USE [master]
GO
/****** Object:  Database [MyExchangeEx]    Script Date: 9/4/2015 4:34:38 PM ******/
CREATE DATABASE [MyExchangeEx]
GO
USE [MyExchangeEx]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[UserName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Balance] [decimal](38, 8) NOT NULL,
	[Currency] [nvarchar](50) NOT NULL,
	[TariffPlan] [nvarchar](50) NOT NULL,	
	[BeginOfTP] [datetime] NOT NULL,	
	[Mode] [nvarchar](10) NOT NULL,
	[Bettor] [bit] NOT NULL,
	[Trade] [bit] NOT NULL,
	[Theme] [nvarchar](10) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[MailNews] [bit] NOT NULL,
	[MailUpdates] [bit] NOT NULL,
	[MailActivity] [nvarchar](20),
	[SmsActivity] [bit] NOT NULL,
	[PushId] [nvarchar](50), 
	[GIDX_CustomerId] [nvarchar](50) ,
	[GIDX_SessionId] [nvarchar](50) 
	
 CONSTRAINT [PK_Account_1] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[PartialExecutions]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PartialExecutions](
	[ID] [nvarchar](50) NOT NULL,
	[Time][datetime] NOT NULL,
	[ExistingOrder] [nvarchar](50) NOT NULL,
	[MakerAccount][nvarchar](50) NOT NULL,
	[NewOrder] [nvarchar](50) NOT NULL,
	[TakerAccount][nvarchar](50)NOT NULL, 
	[Price] [decimal](38, 8) NOT NULL,
	[Quantity] [bigint] NOT NULL,
 CONSTRAINT [PK_PartialExecutions] PRIMARY KEY CLUSTERED 
(
	[ID] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[Fees]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Fees](
	[TakerFee] [decimal](38, 8) NOT NULL,
	[MakerFee] [decimal](38, 8) NOT NULL
 CONSTRAINT [PK_Fees] PRIMARY KEY CLUSTERED 
(
	[TakerFee] ASC,
	[MakerFee] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

GO
/****** Object:  Table [dbo].[TariffPlans]    Script Date: 16/7/2016 8:39:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TariffPlans](
	[Name] [nvarchar](50) NOT NULL,
	[PriceOfPlan] [nvarchar](50) NOT NULL,
	[Quantity] [int] NOT NULL,
 CONSTRAINT [PK_TariffPlan] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Admins]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admins](
	[UserName] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Admins] PRIMARY KEY CLUSTERED 
(
	[UserName] ASC,
	[Password] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Category]    Script Date: 19.08.2016 16:36:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Parent_Id] [uniqueidentifier] NULL,
	[Url] [nvarchar](50) NOT NULL,
	[Icon] [nvarchar](50) NULL,	
	[Position] [int] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_dbo.Category] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Currencies]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Currencies](
	[Name] [nvarchar](50) NOT NULL,
	[Multiplier] [decimal](18, 8) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_Currencies] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Daily]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Daily](
	[SymbolID] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[Open] [decimal](18, 8) NOT NULL,
	[High] [decimal](18, 8) NOT NULL,
	[Low] [decimal](18, 8) NOT NULL,
	[Close] [decimal](18, 8) NOT NULL,
	[Volume] [bigint] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[Side] [bit] NOT NULL
 CONSTRAINT [PK_Daily_1] PRIMARY KEY CLUSTERED 
(
	[SymbolID] ASC,
	[Time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Exchanges]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exchanges](
	[Name] [nvarchar](50) NOT NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[CommonCurrency] [bit] NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_Exchange] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[Executions]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Executions](
	[OrderID] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[Status] [tinyint] NOT NULL,
	[LastPrice] [decimal](18, 8) NOT NULL,
	[PaidUpQuantity] [bigint] NOT NULL,
	[ClosedQuantity] [bigint] NOT NULL,
	[LastQuantity] [bigint] NOT NULL,
	[FilledQuantity] [bigint] NOT NULL,
	[LeaveQuantity] [bigint] NOT NULL,
	[CancelledQuantity] [bigint] NOT NULL,
	[AverrageFillPrice] [decimal](18, 8) NOT NULL,
	[InProcess] [bit] NOT NULL
 CONSTRAINT [PK_Executions_1] PRIMARY KEY CLUSTERED 
(
	[OrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Minutely]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Minutely](
	[SymbolID] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[Open] [decimal](18, 8) NOT NULL,
	[High] [decimal](18, 8) NOT NULL,
	[Low] [decimal](18, 8) NOT NULL,
	[Close] [decimal](18, 8) NOT NULL,
	[Volume] [bigint] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[Side] [bit] NOT NULL
 CONSTRAINT [PK_Minutely_1] PRIMARY KEY CLUSTERED 
(
	[SymbolID] ASC,
	[Time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Orders]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[ID] [nvarchar](50) NOT NULL,
	[AccountID] [nvarchar](50) NOT NULL,
	[SymbolID] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[ActivationTime] [datetime] NULL,
	[Side] [tinyint] NOT NULL,
	[OrderType] [tinyint] NOT NULL,
	[LimitPrice] [decimal](18, 8) NOT NULL,
	[StopPrice] [decimal](18, 8) NOT NULL,
	[Quantity] [bigint] NOT NULL,
	[TimeInForce] [tinyint] NOT NULL,
	[ExpirationDate] [datetime] NOT NULL,
	[IsMirror] [tinyint] NOT NULL
 CONSTRAINT [PK_Orders_1] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Symbols]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Symbols](
	[ID] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Exchange] [nvarchar](50) NOT NULL,
	[Currency] [nvarchar](50) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[HomeName] [nvarchar](50) NOT NULL,
	[HomeAlias] [nvarchar](50) NOT NULL,
	[AwayName] [nvarchar](50) NOT NULL,
	[AwayAlias] [nvarchar](50) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[StatusEvent][nvarchar](50) NOT NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[CategoryId][uniqueidentifier] NOT NULL,
	[TypeEvent] [tinyint] NOT NULL,
	[Url] [nvarchar](100) NOT NULL,
	[Result] [nvarchar](50) NULL,
	[ApprovedDate] [datetime] NULL,
	[SettlementDate] [datetime] NULL,
	[LastPrice][decimal](18, 8) NOT NULL,
	[Side] [tinyint] NULL,
	[LastAsk][decimal](18, 8) NOT NULL,
	[LastBid][decimal](18, 8) NOT NULL,
	[HomePoints] [decimal](4, 1) NULL,
	[HomeHandicap] [decimal](4,1) NULL,
	[AwayPoints] [decimal](4, 1) NULL,
	[AwayHandicap] [decimal](4,1) NULL,
	[PriceChangeDirection][int] NULL,
	[DelayTime][int] NOT NULL
 CONSTRAINT [PK_Symbols] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Symbols] UNIQUE NONCLUSTERED 
(
	[Exchange] ASC,
	[Currency] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tick]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tick](
	[SymbolID] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[Price] [decimal](18, 8) NOT NULL,
	[Volume] [bigint] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[Side] [bit] NOT NULL
 --CONSTRAINT [PK_Tick_1] PRIMARY KEY CLUSTERED 
--(
--	[SymbolID] ASC,
--	[Time] ASC
--)
--WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 9/4/2015 4:34:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserName] [nvarchar](50) NOT NULL,
	[NickName] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[DateOfBirth] [datetime] NOT NULL,
	[Country] [nvarchar](128) NOT NULL,
	[Address] [nvarchar](200) NULL,
	[Phone] [nvarchar](30) NULL,
	[InsertedDate] [datetime] NOT NULL,
	[LastEditedDate] [datetime] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[ConfirmationCode] [nvarchar](100) NULL,
	[ConfirmationExpired] [datetime] NULL,
	[Type] [nvarchar](15) NULL
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

/****** Object:  Table [dbo].[XmlFeedData]    Script Date: 08/09/2016 13:37:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[XmlFeedData](
	[Id] [uniqueidentifier] NOT NULL,
	[Sport] [nvarchar](50) NOT NULL,
	[League] [nvarchar](100) NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[HomeName] [nvarchar](200) NOT NULL,
	[HomeAlias] [nvarchar](10) NOT NULL,
	[AwayName] [nvarchar](200) NOT NULL,
	[AwayAlias] [nvarchar](10) NOT NULL,
	[GameId] [uniqueidentifier] NOT NULL,
	[Status] [nvarchar](20) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[LastEditedDate] [datetime] NOT NULL,
	[StatusExchange] [nvarchar](20) NULL,
	[NameExchange] [nvarchar](50) NULL,
	[HomePoints] [decimal](4, 1) NULL,
	[HomeHandicap] [decimal](4,1) NULL,
	[AwayPoints] [decimal](4, 1) NULL,
	[AwayHandicap] [decimal](4,1) NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_XmlFeedData] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[PaymentsHistory]    Script Date: 20.01.2017 17:15:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[PaymentsHistory](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Amount] [decimal](18, 4) NULL,
	[System] [nvarchar](50) NULL,
	[DateOfPayment] [datetime] NULL,
	[Direction] [varchar](50) NULL,
	[UserId] [nvarchar](50) NULL,
	[TransactId] [nvarchar](50) NULL,
	[Status] [nvarchar](50) NULL,
 CONSTRAINT [PK_PaymentsHistory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


CREATE TABLE [dbo].[UserSessions](
	[Id] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[UserBrowser] [nvarchar](200) NULL,
	[UserIp] [nvarchar](20) NULL,
	[StartSession] [datetime] NOT NULL,
	[EndSession] [datetime] NULL
) ON [PRIMARY]
GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[PaymentsHistory]  WITH CHECK ADD  CONSTRAINT [FK_PaymentsHistory_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Email])
GO

ALTER TABLE [dbo].[PaymentsHistory] CHECK CONSTRAINT [FK_PaymentsHistory_Users]
GO




ALTER TABLE [dbo].[XmlFeedData] ADD  CONSTRAINT [DF_XmlFeedData_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Orders] ADD  CONSTRAINT [DF_Orders_IsMirror]  DEFAULT ((0)) FOR [IsMirror]
GO
ALTER TABLE [dbo].[Currencies] ADD  CONSTRAINT [DF_Currencies_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Symbols] ADD  CONSTRAINT [DF_Symbols_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Exchanges] ADD  CONSTRAINT [DF_Exchanges_IsActive]  DEFAULT ((0)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Exchanges] ADD  CONSTRAINT [DF_Exchanges_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Account_User] FOREIGN KEY([Email])
REFERENCES [dbo].[Users] ([Email])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Account_User]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_Mode]  DEFAULT ((0)) FOR [Mode]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_Bettor]  DEFAULT ((0)) FOR [Bettor]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_Trade]  DEFAULT ((0)) FOR [Trade]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_MailNews]  DEFAULT ((0)) FOR [MailNews]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_MailUpdates]  DEFAULT ((0)) FOR [MailUpdates]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_MailActivity]  DEFAULT (N'daily') FOR [MailActivity]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_SmsActivity]  DEFAULT ((0)) FOR [SmsActivity]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_PushId]  DEFAULT ((0)) FOR [PushId]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_GIDX_CustomerId]  DEFAULT ((0)) FOR [GIDX_CustomerId]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_GIDX_SessionId]  DEFAULT ((0)) FOR [GIDX_SessionId]
GO
ALTER TABLE [dbo].[Accounts] ADD  CONSTRAINT [DF_Accounts_Theme]  DEFAULT (N'dark') FOR [Theme]
GO
ALTER TABLE [dbo].[Tick] ADD  CONSTRAINT [DF_Tick_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Daily] ADD  CONSTRAINT [DF_Daily_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Minutely] ADD  CONSTRAINT [DF_Minutely_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Category] ADD  CONSTRAINT [DF_Category_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_Currencies] FOREIGN KEY([Currency])
REFERENCES [dbo].[Currencies] ([Name])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_Currencies]
GO

ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD  CONSTRAINT [FK_Accounts_TariffPlan] FOREIGN KEY([TariffPlan])
REFERENCES [dbo].[TariffPlans] ([Name])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Accounts] CHECK CONSTRAINT [FK_Accounts_TariffPlan]
GO

ALTER TABLE [dbo].[Symbols]  WITH CHECK ADD  CONSTRAINT [FK_Symbols_Category] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Symbols] CHECK CONSTRAINT [FK_Symbols_Category]
GO


ALTER TABLE [dbo].[PartialExecutions] WITH CHECK ADD CONSTRAINT [FK_PartialExecutions_Orders_1] FOREIGN KEY ([ExistingOrder])
REFERENCES [dbo].[Orders] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PartialExecutions] CHECK CONSTRAINT [FK_PartialExecutions_Orders_1]
GO

ALTER TABLE [dbo].[PartialExecutions] WITH CHECK ADD CONSTRAINT [FK_PartialExecutions_Orders_2] FOREIGN KEY ([NewOrder])
REFERENCES [dbo].[Orders] ([ID])
ON UPDATE NO ACTION
ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[PartialExecutions] CHECK CONSTRAINT [FK_PartialExecutions_Orders_2]
GO

ALTER TABLE [dbo].[Daily]  WITH CHECK ADD  CONSTRAINT [FK_Daily_Symbols] FOREIGN KEY([SymbolID])
REFERENCES [dbo].[Symbols] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Daily] CHECK CONSTRAINT [FK_Daily_Symbols]
GO
ALTER TABLE [dbo].[Executions]  WITH CHECK ADD  CONSTRAINT [FK_Executions_Orders] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Orders] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Executions] CHECK CONSTRAINT [FK_Executions_Orders]
GO
ALTER TABLE [dbo].[Minutely]  WITH CHECK ADD  CONSTRAINT [FK_Minutely_Symbols] FOREIGN KEY([SymbolID])
REFERENCES [dbo].[Symbols] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Minutely] CHECK CONSTRAINT [FK_Minutely_Symbols]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_Accounts1] FOREIGN KEY([AccountID])
REFERENCES [dbo].[Accounts] ([Name])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_Orders_Accounts1]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_Symbols1] FOREIGN KEY([SymbolID])
REFERENCES [dbo].[Symbols] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_Orders_Symbols1]
GO
ALTER TABLE [dbo].[Symbols]  WITH CHECK ADD  CONSTRAINT [FK_Symbol_Exchange] FOREIGN KEY([Exchange])
REFERENCES [dbo].[Exchanges] ([Name])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Symbols] CHECK CONSTRAINT [FK_Symbol_Exchange]
GO
ALTER TABLE [dbo].[Symbols]  WITH CHECK ADD  CONSTRAINT [FK_Symbols_Currencies] FOREIGN KEY([Currency])
REFERENCES [dbo].[Currencies] ([Name])
GO
ALTER TABLE [dbo].[Symbols] CHECK CONSTRAINT [FK_Symbols_Currencies]
GO
ALTER TABLE [dbo].[Tick]  WITH CHECK ADD  CONSTRAINT [FK_Tick_Symbols] FOREIGN KEY([SymbolID])
REFERENCES [dbo].[Symbols] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Tick] CHECK CONSTRAINT [FK_Tick_Symbols]
GO
USE [master]
GO
ALTER DATABASE [MyExchangeEx] SET  READ_WRITE 
GO