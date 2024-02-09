import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'my-todo-app'
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    try:
        # Extrahiere die UserID und TodoID aus dem Event
        user_id = event['UserID']
        todo_id = event['TodoID']

        # Lösche den Task aus der Tabelle
        response = table.delete_item(
            Key={
                'UserID': user_id,
                'TodoID': todo_id
            }
        )

        # Erfolgreiche Löschungsnachricht zurückgeben
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f"Eintrag erfolgreich gelöscht für UserID: {user_id}, TodoID: {todo_id}"})
        }
    except Exception as e:
        # Bei Fehlern eine Fehlermeldung zurückgeben
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
