from fastapi import FastAPI
from sqlalchemy import create_engine, text

app = FastAPI()

# Sửa lại dòng này đúng y chang như vầy:
DATABASE_URL = "mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=.;DATABASE=RoomHubDB;Trusted_Connection=yes;TrustServerCertificate=yes;"    

engine = create_engine(DATABASE_URL)

@app.get("/api/rooms")
def get_rooms():
    try:
        with engine.connect() as conn:
            # Dùng text() để chạy query
            result = conn.execute(text("SELECT RoomID, Title, Price, Area FROM Rooms"))
            data = [dict(row._mapping) for row in result]
            return data
    except Exception as e:
        return {"loi_ket_noi_la": str(e)}