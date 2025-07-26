# -*- coding: utf-8 -*-
import os
import psycopg2
import psycopg2.extras
import logging
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

LOG_PATH = "/logs/chatbot.log"
os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)

logger = logging.getLogger("chatbot")
handler = logging.FileHandler(LOG_PATH)
formatter = logging.Formatter("%(asctime)s - %(message)s")
handler.setFormatter(formatter)
logger.setLevel(logging.INFO)
logger.addHandler(handler)

PG_URL = os.getenv("SUPABASE_DB_URL", "")
PG_HOST = os.getenv("PG_HOST")
PG_USER = os.getenv("PG_USER")
PG_PASSWORD = os.getenv("PG_PASSWORD")
PG_DB = os.getenv("PG_DB")
PG_PORT = os.getenv("PG_PORT")


def get_connection():
    if PG_URL:
        return psycopg2.connect(PG_URL, cursor_factory=psycopg2.extras.RealDictCursor)
    return psycopg2.connect(
        host=PG_HOST or "localhost",
        user=PG_USER or "rasa",
        password=PG_PASSWORD or "",
        dbname=PG_DB or "rasa",
        port=int(PG_PORT or 5432),
        cursor_factory=psycopg2.extras.RealDictCursor,
    )


def log_interaction(tenant: str, username: str, menu_option: str, message: str, response: str) -> None:
    logger.info(f"{tenant} | {username} | {menu_option} | {message} | {response}")
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO interactions (tenantSlug, username, menuOption, message, response, isFallback)
                VALUES (%s, %s, %s, %s, %s, %s)
                """.strip(),
                (tenant, username, menu_option, message, response, 1 if "Opción no válida" in response else 0),
            )
            connection.commit()
    except Exception as e:
        logger.error(f"Error logging interaction in DB: {e}")
    finally:
        if "connection" in locals():
            connection.close()


class ActionShowMenu(Action):
    def name(self) -> Text:
        return "action_show_menu"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        sender_id = tracker.sender_id
        if "__" in sender_id:
            tenant, username = sender_id.split("__", 1)
        else:
            tenant, username = "default", sender_id

        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT m.opcion_num, m.label
                    FROM menus m
                    JOIN tenants t ON m.tenantId = t.id
                    WHERE t.slug = %s
                    ORDER BY m.opcion_num
                    """.strip(),
                    (tenant,),
                )
                results = cursor.fetchall()

            if results:
                lines = [f"{row['opcion_num']}. {row['label']}" for row in results]
                menu_text = f"Menú de {tenant}:\n" + "\n".join(lines)
            else:
                menu_text = f"No hay opciones de menú para {tenant}."

            dispatcher.utter_message(text=menu_text)
            log_interaction(tenant, username, "-", tracker.latest_message.get("text", ""), menu_text)
        except Exception as e:
            error_msg = f"Error consultando menú en BBDD: {e}"
            dispatcher.utter_message(text=error_msg)
            logger.error(error_msg)
        finally:
            if "connection" in locals():
                connection.close()

        return []


class ActionRespondMenuOption(Action):
    def name(self) -> Text:
        return "action_respond_menu_option"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        sender_id = tracker.sender_id
        if "__" in sender_id:
            tenant, username = sender_id.split("__", 1)
        else:
            tenant, username = "default", sender_id

        user_message = tracker.latest_message.get("text", "").strip()
        menu_num = None
        try:
            menu_num = int(user_message.split()[0])
        except Exception:
            pass

        response_text = ""
        if menu_num:
            try:
                connection = get_connection()
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT label, response
                        FROM menus m
                        JOIN tenants t ON m.tenantId = t.id
                        WHERE t.slug = %s AND m.opcion_num = %s
                        """.strip(),
                        (tenant, menu_num),
                    )
                    result = cursor.fetchone()

                if result:
                    response_text = result["response"]
                else:
                    response_text = "Opción no válida."

                dispatcher.utter_message(text=response_text)
                log_interaction(
                    tenant, username, f"Opción {menu_num}", user_message, response_text
                )
            except Exception as e:
                error_msg = f"Error respondiendo opción menú: {e}"
                dispatcher.utter_message(text=error_msg)
                logger.error(error_msg)
            finally:
                if "connection" in locals():
                    connection.close()
        else:
            response_text = "Por favor, indique el número de opción del menú."
            dispatcher.utter_message(text=response_text)
            log_interaction(tenant, username, "-", user_message, response_text)

        return []
