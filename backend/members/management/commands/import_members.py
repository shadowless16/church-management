import csv
import uuid
from django.core.management.base import BaseCommand
from members.models import Member
from django.utils.dateparse import parse_date

class Command(BaseCommand):
    help = 'Import members from a CSV file.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file.')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                # Convert fields as needed
                address = row.get('address', '{}')
                ministry = row.get('ministry', '[]')
                try:
                    member = Member(
                        # id is auto
                        first_name=row['first_name'],
                        last_name=row['last_name'],
                        email=row['email'],
                        phone=row.get('phone', ''),
                        date_of_birth=parse_date(row.get('date_of_birth')) if row.get('date_of_birth') else None,
                        gender=row.get('gender', ''),
                        address=eval(address) if address else {},
                        status=row.get('status', 'new'),
                        join_date=parse_date(row['join_date']) if row.get('join_date') else None,
                        ministry=eval(ministry) if ministry else [],
                        notes=row.get('notes', ''),
                        profession=row.get('profession', ''),
                        marital_status=row.get('marital_status', ''),
                        # profile_picture is skipped
                    )
                    member.save()
                    count += 1
                except Exception as e:
                    self.stderr.write(f"Error importing row: {row}\n{e}")
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} members.'))
