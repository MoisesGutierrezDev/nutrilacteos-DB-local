import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta-nutrilacteos-2026'
    DEBUG = True