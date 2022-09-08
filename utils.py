from classes import *
from sqlalchemy import *

def reload_plays(team, opponent, team_code, year):
    past_plays = db.session.query(Game).filter(Game.Team_Name == team) .\
    filter(Game.Opponent_Name == opponent) .\
        filter(Game.Owner_Team_Code == team_code) .\
            filter(Game.Year == int(year)).order_by(desc(Game.PlayNum)).limit(100).all()
    return past_plays

def load_games_json(game):
    json = []
    for play in game:
        json.append({
            "Team_Name": play.Team_Name,
            "Opponent_Name": play.Opponent_Name,
            "Year": play.Year,
            "PlayNum": play.PlayNum,
            "Possession": play.Possession,
            "Yard": play.Yard,
            "Hash": play.Hash,
            "Down": play.Down,
            "Distance": play.Distance,
            "Drive": play.Drive,
            "Quarter": play.Quarter,
            "D_Formation": play.D_Formation,
            "Formation": play.Formation,
            "Formation_Strength": play.Formation_Strength,
            "Play_Type": play.Play_Type,
            "Play_Type_Dir": play.Play_Type_Dir,
            "Pass_Zone": play.Pass_Zone,
            "Coverage": play.Coverage,
            "Pressure_Left": play.Pressure_Left,
            "Pressure_Middle": play.Pressure_Middle,
            "Pressure_Right": play.Pressure_Right,
            "Result_Lat": play.Result_Lat,
            "Result_Lon": play.Result_Lon,
            "Play_Lat": play.Play_Lat,
            "Play_Lon": play.Play_Lon,
            "Result": play.Result,
            "Result_BallCarrier": play.Result_BallCarrier
        })
    return json

def load_games_formations_json(game):
    json = []
    for play in game:
        json.append({
            "Team_Name": play.Game.Team_Name,
            "Opponent_Name": play.Game.Opponent_Name,
            "Year": play.Game.Year,
            "PlayNum": play.Game.PlayNum,
            "Possession": play.Game.Possession,
            "Yard": play.Game.Yard,
            "Hash": play.Game.Hash,
            "Down": play.Game.Down,
            "Distance": play.Game.Distance,
            "Drive": play.Game.Drive,
            "Quarter": play.Game.Quarter,
            "D_Formation": play.Game.D_Formation,
            "Formation": play.Game.Formation,
            "Formation_Strength": play.Game.Formation_Strength,
            "WR": play.Formation.Wide_Recievers,
            "TE": play.Formation.Tight_Ends,
            "RB": play.Formation.Running_Backs,
            "Personnel": str(play.Formation.Wide_Recievers) + 'WR|' + str(play.Formation.Tight_Ends) + 'TE|' + str(play.Formation.Running_Backs) + 'RB',
            "Play_Type": play.Game.Play_Type,
            "Play_Type_Dir": play.Game.Play_Type_Dir,
            "Pass_Zone": play.Game.Pass_Zone,
            "Coverage": play.Game.Coverage,
            "Pressure_Left": play.Game.Pressure_Left,
            "Pressure_Middle": play.Game.Pressure_Middle,
            "Pressure_Right": play.Game.Pressure_Right,
            "Result_Lat": play.Game.Result_Lat,
            "Result_Lon": play.Game.Result_Lon,
            "Play_Lat": play.Game.Play_Lat,
            "Play_Lon": play.Game.Play_Lon,
            "Result": play.Game.Result,
            "Result_BallCarrier": play.Game.Result_BallCarrier
        })
    return json
