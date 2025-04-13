/* 認証・認可に関連するテーブル */
-- ユーザー情報を格納するテーブル
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY COMMENT 'ユーザーID（UUID形式）',
    username VARCHAR(255) NOT NULL UNIQUE COMMENT 'ログイン用ユーザー名（一意制約）',
    password VARCHAR(255) NOT NULL COMMENT 'ハッシュ化されたパスワード',
    email VARCHAR(255) UNIQUE COMMENT 'メールアドレス（NULL許可、一意制約）',
    is_active BOOLEAN DEFAULT TRUE COMMENT '有効フラグ（論理削除用などに利用）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード更新日時（自動更新）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザー情報テーブル';
-- ロール情報を格納するテーブル
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) NOT NULL PRIMARY KEY COMMENT 'ロールID（UUID形式）',
    name VARCHAR(30) NOT NULL UNIQUE COMMENT 'ロール名（Admin, User, Guestなど）',
    description VARCHAR(255) COMMENT 'ロールの説明',
    inherits_from CHAR(36) NULL COMMENT '継承元のロールID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード更新日時（自動更新）',
    CONSTRAINT fk_inherits_from FOREIGN KEY (inherits_from) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ロール情報テーブル';
-- ユーザーとロールを紐づける中間テーブル
CREATE TABLE IF NOT EXISTS user_roles (
    user_id CHAR(36) NOT NULL COMMENT 'ユーザーID（usersテーブルのUUID）',
    role_id CHAR(36) NOT NULL COMMENT 'ロールID（rolesテーブルのUUID）',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'ロールが付与された日時',
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザーとロールの紐づけテーブル';
-- UUIDを使ったリフレッシュトークンテーブル
CREATE TABLE IF NOT EXISTS  refresh_tokens (
  id CHAR(36) PRIMARY KEY COMMENT '主キー: リフレッシュトークンのUUID',
  user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '対象のユーザーID(UUID)',
  token VARCHAR(512) NOT NULL UNIQUE COMMENT 'リフレッシュトークンの文字列（JWTなど）',

  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '発行日時',
  expires_at DATETIME NOT NULL COMMENT '有効期限',
  revoked_at DATETIME DEFAULT NULL COMMENT '無効化された日時（null = 有効）',

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザーごとのリフレッシュトークンを管理するテーブル（UUID）';

/* ロール */
-- Guest（最下層、親なし）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1e446b-06dc-11f0-9fce-6a0ec65304f1', 'Guest', '閲覧専用のゲストユーザー', NULL);
-- User（Guestを継承）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1', 'User', '標準的なユーザー権限', '3d1e446b-06dc-11f0-9fce-6a0ec65304f1');
-- Admin（Userを継承）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1de6e4-06dc-11f0-9fce-6a0ec65304f1', 'Admin', '管理者権限を持つユーザー', '3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1');
