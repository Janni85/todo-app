import json
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        # Dynamischer Tabellenname (kann als Umgebungsvariable oder im Event übergeben werden)
        table_name = 'my-todo-app'
        table = dynamodb.Table(table_name)

        # UserID aus dem API Gateway-Event extrahieren
        user_id = event['queryStringParameters']['UserID']

        # TodoID aus dem API Gateway-Event extrahieren (falls vorhanden)
        todo_id = event['queryStringParameters'].get('TodoID')

        if todo_id:  # Wenn TodoID angegeben ist, nur die Aufgabe mit der TodoID zurückgeben
            response = table.query(
                KeyConditionExpression=boto3.dynamodb.conditions.Key('UserID').eq(user_id) & boto3.dynamodb.conditions.Key('TodoID').eq(todo_id)
            )
        else:  # Andernfalls alle Aufgaben für die UserID zurückgeben
            response = table.query(
                KeyConditionExpression=boto3.dynamodb.conditions.Key('UserID').eq(user_id)
            )

        items = response.get('Items', [])

        # Extrahiere 'Task' und 'TodoID' aus jedem Eintrag
        tasks = [{'Task': item.get('Task'), 'TodoID': item.get('TodoID'), 'Datum': item.get('Datum'), 'Completed': item.get('Completed')} for item in items if 'Task' in item and 'TodoID' in item]

        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # Hier kannst du auch die genaue Ursprungsdomain angeben, wenn bekannt
        }

        return {
            'statusCode': 200,
            'body': json.dumps({'Tasks': tasks}),
            'headers': headers
        }

    except Exception as e:
        # Spezifischere Fehlercodes/Meldungen könnten hier hilfreich sein
        print(f"Fehler: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Interner Serverfehler'}),
            'headers': {'Content-Type': 'application/json'}
        }
        
# Test-Event
# {
#   "queryStringParameters": {
#     "UserID": "1000"
#   }
# }