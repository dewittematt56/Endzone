from Endzone_Database.db import db
# User Class
class User(db.Model):
    __tablename__ = 'User'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    First_Name  = db.Column(db.String(25), nullable = False)
    Last_Name  = db.Column(db.String(25), nullable = False)
    Email  = db.Column(db.String(320), nullable = False)
    Password  = db.Column(db.String(128), nullable = False)
    Team_Code  = db.Column(db.String(20), nullable = False)
    Access = db.Column(db.String(25), nullable = False)    
    IS_Reviewed = db.Column(db.Boolean, nullable=False)

    def __init__(self, first, last, email, password, team, access, IS_Reviewed):
        self.First_Name = first
        self.Last_Name = last
        self.Email = email   
        self.Password = password   
        self.Team_Code = team
        self.Access = access   
        self.IS_Reviewed = IS_Reviewed

class Team(db.Model):
    __tablename__ = 'Team'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Team_Name = db.Column(db.String(100), nullable = False)
    Team_Code = db.Column(db.String(20), nullable = False)

    def __init__(self, team_name, team_code):
        self.Team_Name = team_name
        self.Team_Code = team_code

class GameLoad(db.Model):
    __tablename__ = 'GameLoad'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Team_Name = db.Column(db.String(100), nullable = False)
    Opponent_Name = db.Column(db.String(100), nullable = False)
    User_Team_Code = db.Column(db.String(20), nullable = False)
    Year = db.Column(db.Integer, nullable = False)

    def __init__(self, team_name, opponent_name, team_code, year):
        self.Team_Name = team_name
        self.Opponent_Name = opponent_name
        self.User_Team_Code = team_code
        self.Year = year

class Model(db.Model):
    __tablename__ = 'KIPP_Models'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Model_Name = db.Column(db.String(100), nullable = False)
    Model_Type = db.Column(db.String(100), nullable = False)
    Team_Code = db.Column(db.String(20), nullable = False)

class Game(db.Model):
    __tablename__ = 'Game'
    # Metadata
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Team_Name = db.Column(db.String(100), nullable = False)
    Opponent_Name = db.Column(db.String(100), nullable = False)
    Year = db.Column(db.Integer, nullable = False)
    Owner_Team_Code = db.Column(db.String(20), nullable = False)
    # Actual Columns
    PlayNum = db.Column(db.Integer, nullable = False)
    Possession = db.Column(db.String(100), nullable = False)    
    Yard = db.Column(db.Integer, nullable = False)
    Hash = db.Column(db.String(10), nullable = False)
    Down = db.Column(db.Integer, nullable = False)
    Distance = db.Column(db.Integer, nullable = False)
    Drive = db.Column(db.Integer, nullable = False)
    Quarter = db.Column(db.Integer, nullable = False)
    D_Formation = db.Column(db.String(15), nullable = False)
    Formation = db.Column(db.String(50), nullable = False)
    Formation_Strength = db.Column(db.String(10), nullable = False)
    Play_Type = db.Column(db.String(20), nullable = False)
    Play_Type_Dir = db.Column(db.String(12), nullable = False)
    Pass_Zone = db.Column(db.String(20), nullable = False)
    Coverage = db.Column(db.String(20), nullable = False)
    Pressure_Left = db.Column(db.Integer, nullable = False)
    Pressure_Middle = db.Column(db.Integer, nullable = False)
    Pressure_Right = db.Column(db.Integer, nullable = False)
    Result = db.Column(db.Integer, nullable = False)
    Result_BallCarrier = db.Column(db.Integer, nullable = False)
    Event = db.Column(db.String(20), nullable = True)
    Result_Lat = db.Column(db.Float(), nullable=False)
    Result_Lon = db.Column(db.Float(), nullable=False)
    Play_Lat = db.Column(db.Float(), nullable=False)
    Play_Lon = db.Column(db.Float(), nullable=False)
    Simplified = db.Column(db.String(20), nullable = False)

    def __init__(self, Team_Name, Opponent_Name, Year, Owner_Team_Code, PlayNum, Possession, Yard, Hash, Down, Distance, Drive, Quarter, D_Formation, Formation, Formation_Strength, Play_Type, Play_Type_Dir, Pass_Zone, Coverage, Pressure_Left, Pressure_Middle, Pressure_Right, Result, Result_BallCarrier, Event, Result_Lat, Result_Lon, Lat, Lon, Simple):
        self.Team_Name = Team_Name
        self.Opponent_Name = Opponent_Name
        self.Year = Year
        self.Owner_Team_Code = Owner_Team_Code
        self.PlayNum = PlayNum
        self.Possession = Possession
        self.Yard = Yard
        self.Hash = Hash
        self.Down = Down
        self.Distance = Distance
        self.Drive = Drive
        self.Quarter = Quarter
        self.D_Formation = D_Formation
        self.Formation = Formation
        self.Formation_Strength = Formation_Strength
        self.Play_Type = Play_Type
        self.Play_Type_Dir = Play_Type_Dir
        self.Pass_Zone = Pass_Zone
        self.Coverage = Coverage
        self.Pressure_Left = Pressure_Left
        self.Pressure_Middle = Pressure_Middle
        self.Pressure_Right = Pressure_Right
        self.Result = Result
        self.Result_BallCarrier = Result_BallCarrier
        self.Event = Event
        self.Result_Lat = Result_Lat
        self.Result_Lon = Result_Lon
        self.Play_Lat = Lat
        self.Play_Lon = Lon
        self.Simplified = Simple

class Formation(db.Model):
    __tablename__ = 'Formation'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Formation = db.Column(db.String(50), nullable = False)
    Team_Code = db.Column(db.String(20), nullable = False)
    Wide_Recievers = db.Column(db.Integer, nullable = False, default = 0)
    Tight_Ends = db.Column(db.Integer, nullable = False, default = 0)
    Running_Backs = db.Column(db.Integer, nullable = False, default = 0)
    Image = db.Column(db.String(100), nullable = True, default = 0)
    def __init__(self, Formation, Team_Code, Wide_Recievers, Tight_Ends, Running_Backs, Image):
        self.Formation = Formation
        self.Team_Code =Team_Code
        self.Wide_Recievers = Wide_Recievers
        self.Tight_Ends = Tight_Ends
        self.Running_Backs = Running_Backs
        self.Image = Image