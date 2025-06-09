from django.core.management.base import BaseCommand
from members.models import Member

class Command(BaseCommand):
    help = 'Bulk delete all members from the database.'

    def handle(self, *args, **options):
        count, _ = Member.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} members.'))
