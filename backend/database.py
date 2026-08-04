from sqlalchemy import create_engine

# Đã đổi thành pymssql siêu mượt
DATABASE_URL = "mssql+pymssql://db_acbd86_roomhub_admin:vapcom123@sql8020.site4now.net/db_acbd86_roomhub"
engine = create_engine(DATABASE_URL)