import json
import boto3
import datetime

dynamodb = boto3.resource('dynamodb')
table_name = 'my-todo-app'  # Hier könnte eine Umgebungsvariable oder Konfigurationsdatei verwendet werden

def lambda_handler(event, context):
    table = dynamodb.Table(table_name)

    body = json.loads(event.get('body', '{}'))
    user_id = body.get('UserID')
    todo_id = body.get('TodoID')
    task = body.get('Task')
    datum = body.get('Datum')
    completed = body.get('Completed')

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
    }

    if not all([user_id, todo_id]):
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'UserID und TodoID sind erforderlich'})
        }

    try:
        if task is None or datum is None:
            existing_data = table.get_item(Key={'UserID': user_id, 'TodoID': todo_id}).get('Item', {})
            task = existing_data.get('Task', '')
            datum = existing_data.get('Datum', '')

        # Hier könntest du das Datum formatieren oder überprüfen, ob es im richtigen Format vorliegt

        response = table.put_item(
            Item={
                'UserID': user_id,
                'TodoID': todo_id,
                'Task': task,
                'Datum': datum,
                'Completed': completed
            }
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Eintrag erfolgreich hinzugefügt oder aktualisiert'})
        }
        
    except Exception as e:
        # Hier könntest du detailliertere Fehlerinformationen bereitstellen
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': str(e)})
        }
        
# Test-Event
# {
#   "body": "{\"UserID\": \"1000\", \"TodoID\": \"20\", \"Task\": \"Task 100\", \"Datum\": \"datum\"}"
# }