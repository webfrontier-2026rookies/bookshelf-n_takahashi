-- マイクロサービスごとにデータベースを分離する（database per service）
CREATE DATABASE IF NOT EXISTS bookshelf_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS bookshelf_catalog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
