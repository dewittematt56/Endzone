import sys
import logging

logging.basicConfig(level=logging.DEBUG, filename = 'var/www/html/Endzone/logs/endzone.log')

sys.path.insert(0, '/var/www/html/Endzone')
sys.path.insert(0, 'var/www/html/Endzone/pyenv/lib/python3.9/site-packages')
from app import app as application
