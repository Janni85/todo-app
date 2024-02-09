import json
import boto3

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    # Ersetze dies mit dem tatsächlichen Namen deiner DynamoDB-Tabelle
    table_name = 'my-todo-app'
    table = dynamodb.Table(table_name)

    # Beispiel: Extrahiere Daten aus dem Event-Body
    body = json.loads(event.get('body', '{}'))
    user_id = body.get('UserID')
    # Stelle sicher, dass dieser Schlüssel im Body enthalten ist
    todo_id = body.get('TodoID')
    task = body.get('Task')

    # Stelle sicher, dass alle notwendigen Daten vorhanden sind
    if not all([user_id, todo_id]):
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Erlaubt Zugriffe von jedem Ursprung
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,UPDATE'
            },
            'body': json.dumps({'message': 'Missing parameters'})
        }

    # Versuche, den neuen Eintrag in DynamoDB einzufügen
    try:
        response = table.put_item(
            Item={
                'UserID': user_id,
                'TodoID': todo_id,
                'Task': task
            }
        )
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Erlaubt Zugriffe von jedem Ursprung
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,UPDATE'
            },
            'body': json.dumps({'message': 'Task successfully added'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Erlaubt Zugriffe von jedem Ursprung
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,UPDATE'
            },
            'body': json.dumps({'message': str(e)})
        }
