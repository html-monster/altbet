SET SOURCE=..\Alt.Bet.Admin\Scripts
SET SOURCE_CSS=..\Alt.Bet.Admin\Content
SET DEST=d:\Project\11\

md %DEST%\js-assets\ && copy %SOURCE%\js-assets\* %DEST%\js-assets\*
copy %SOURCE%\js-assets.json %DEST%\js-assets.json

md %DEST%\css-assets\ && copy %SOURCE_CSS%\css-assets\* %DEST%\css-assets\*
copy %SOURCE_CSS%\css-assets.json %DEST%\css-assets.json
