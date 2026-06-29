# database.py
from sqlalchemy import create_engine

DATABASE_URL = "mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=.;DATABASE=RoomHubDB;Trusted_Connection=yes;TrustServerCertificate=yes;"
engine = create_engine(DATABASE_URL)