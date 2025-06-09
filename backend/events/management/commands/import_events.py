import csv
from django.core.management.base import BaseCommand
from events.models import Event
from django.utils.dateparse import parse_date, parse_time

class Command(BaseCommand):
    help = 'Import events from a CSV file.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file.')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                try:
                    event = Event(
                        title=row['title'],
                        description=row.get('description', ''),
                        date=parse_date(row['date']) if row.get('date') else None,
                        start_time=parse_time(row['start_time']) if row.get('start_time') else None,
                        location=row.get('location', ''),
                        ministry=row.get('ministry', ''),
                        status=row.get('status', ''),
                    )
                    event.save()
                    count += 1
                except Exception as e:
                    self.stderr.write(f"Error importing row: {row}\n{e}")
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} events.'))
