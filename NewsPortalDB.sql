CREATE DATABASE NewsPortalDB;
GO

USE NewsPortalDB;
GO

-- ========================
-- Table: SystemAccount
-- ========================
CREATE TABLE SystemAccount (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    AccountName NVARCHAR(100) NOT NULL,
    AccountEmail NVARCHAR(100) NOT NULL UNIQUE,
    AccountRole NVARCHAR(50),
    AccountPassword NVARCHAR(255) NOT NULL
);
GO

-- ========================
-- Table: Category
-- ========================
CREATE TABLE Category (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    CategoryDescription NVARCHAR(255),
    ParentCategoryID INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (ParentCategoryID) REFERENCES Category(CategoryID)
);
GO

-- ========================
-- Table: NewsArticle
-- ========================
CREATE TABLE NewsArticle (
    NewsArticleID INT IDENTITY(1,1) PRIMARY KEY,
    NewsTitle NVARCHAR(255) NOT NULL,
    Headline NVARCHAR(255),
    CreatedDate DATETIME DEFAULT GETDATE(),
    NewsContent NVARCHAR(MAX),
    NewsSource NVARCHAR(255),
    CategoryID INT,
    NewsStatus NVARCHAR(50),
    CreatedByID INT,
    UpdatedByID INT,
    ModifiedDate DATETIME NULL,

    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    FOREIGN KEY (CreatedByID) REFERENCES SystemAccount(AccountID),
    FOREIGN KEY (UpdatedByID) REFERENCES SystemAccount(AccountID)
);
GO

-- ========================
-- Table: Tag
-- ========================
CREATE TABLE Tag (
    TagID INT IDENTITY(1,1) PRIMARY KEY,
    TagName NVARCHAR(100) NOT NULL,
    Note NVARCHAR(255)
);
GO

-- ========================
-- Table: NewsTag (Many-to-Many)
-- ========================
CREATE TABLE NewsTag (
    NewsArticleID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (NewsArticleID, TagID),
    FOREIGN KEY (NewsArticleID) REFERENCES NewsArticle(NewsArticleID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES Tag(TagID) ON DELETE CASCADE
);
GO
