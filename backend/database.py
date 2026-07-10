from sqlalchemy import create_engine

# Chuỗi kết nối đã được gắn mật khẩu vapcom123 của ní vô rồi nha
DATABASE_URL = "mssql+pyodbc://db_acbd86_roomhub_admin:vapcom123@sql8020.site4now.net/db_acbd86_roomhub?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(DATABASE_URL)