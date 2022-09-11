from flask import Blueprint, send_file, request, Response, jsonify
from db import db
from classes import Game, Formation
from login import user_login
from flask_login import current_user
from sqlalchemy import asc, create_engine, true
from utils import load_games_json
import pandas as pd
import os
from db import db_uri
import time

utils_api = Blueprint("Utils", __name__)

@utils_api.route('/endzone/rest/getformation', methods = ["GET"])
# Parameters: None
def getFormation():
    try:
        query = db.session.query(Formation.Formation).filter(Formation.Team_Code == current_user.team_code).distinct().order_by(asc(Formation.Formation))
        formations = []
        for form in query.all():
            formations.append(form[0])
        return jsonify(formations)
    except Exception as e:
        return Response(str(e), status = 404)

@utils_api.route("/endzone/rest/getdata", methods = ["GET"])
# Parameters required: TeamCode, Full (Boolean)
# Optional Params: Team, Opponent, Year
def getData():
    try:
        if request.args.get("full") == "false":
            query = db.session.query(Game).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Owner_Team_Code == request.args.get("teamcode")).order_by(asc(Game.PlayNum))
        else:
            query = db.session.query(Game).filter(Game.Owner_Team_Code == request.args.get("teamcode")).order_by(asc(Game.ID))
        return jsonify(load_games_json(query.all()))
    except Exception as e:
        Response(str(e), status=500)
    
@utils_api.route('/endzone/rest/addplay', methods = ["POST"])
# Parameters: Full Game Parameters
def addPlay():
    try:
        columns = ["team", "opponent", "year", "teamcode", "simplified", "playnum", "drive", "quarter", "possession", "yard", "hash", "down", "distance", "dformation", "formation", "strength", "playtype", "playdir", "passzone", "coverage", "result", "ballcarrier", "pright", "pmiddle", "pleft", "pstunt", "lat", "lon", "r_lat", "r_lon"]
        for col in columns:
            if col not in request.args.to_dict().keys():
                print(col)
                return Response("Missing arg: " + col, status=404)
            else:
                pass
        # Add Play to database
        new_play = Game(request.args.get("team"), request.args.get("opponent"), request.args.get("year"), request.args.get("teamcode"), request.args.get("playnum"), request.args.get("possession"), request.args.get("yard"), request.args.get("hash"), request.args.get("down"), request.args.get("distance"), request.args.get("drive"), request.args.get("quarter"), request.args.get("dformation"), request.args.get("formation"), request.args.get("strength"),
                            request.args.get("playtype"), request.args.get("playdir"), request.args.get("passzone"), request.args.get("coverage"), request.args.get("pleft"), request.args.get("pmiddle"), request.args.get("pright"), request.args.get("result"), request.args.get("ballcarrier"), request.args.get("r_lat"), request.args.get("r_lon"), request.args.get("lat"), request.args.get("lon"), request.args.get("simplified"))
        db.session.add(new_play)
        db.session.commit()
        return Response("Success", status=200)
    except Exception as e:
        print(e)
        return Response(str(e), status=500)

@utils_api.route('/endzone/rest/updateplay', methods = ["POST"])
# Parameters: Team Code, ID
def updatePlay():
    try:
        columns = ["team", "opponent", "year", "teamcode", "playnum", "drive", "possession", "yard", "hash", "down", "distance", "formation", "strength", "playtype", "playdir", "passzone", "dform", "coverage", "pleft", "pmiddle", "pright", "result"]
        for col in columns:
            if col not in request.args.to_dict().keys():
                print(col)
                return Response("Missing arg: " + col, status=404)
        else:
            pass
        # Update Play
        db.session.query(Game).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Owner_Team_Code == request.args.get("teamcode")).filter(Game.PlayNum == request.args.get("playnum")) .\
            update({'PlayNum': request.args.get("playnum"), 'Drive': request.args.get("drive"), 'Possession': request.args.get("possession"), 'Yard': request.args.get('yard'), 'Hash': request.args.get('hash'), 'Down': request.args.get("down"),
            'Distance': request.args.get("distance"), 'Formation': request.args.get("formation"),  'Formation_Strength': request.args.get("strength"), 'Play_Type': request.args.get("playtype"), 'Play_Type_Dir': request.args.get("playdir"),
            'Pass_Zone': request.args.get("passzone"), 'Coverage': request.args.get("coverage"), 'Result': request.args.get("result"), 'Pressure_Left': request.args.get("pleft"), 'Pressure_Middle': request.args.get("pmiddle"), 'Pressure_Right': request.args.get("pright")})
        db.session.commit()
        return Response("Updated: " + request.args.get("playnum"), status = 200)
    except Exception as e:
        print(e)
        return Response(str(e), status = 500)
    # Get Team, Opponent, Year, Teamcode, # Payload
    return "Update Play"

@utils_api.route('/endzone/rest/deleteplay', methods = ["POST"])
# Parameters: Team Code, PlayNum, Team, Opponent, Year
def deletePlay():
    try:
        columns = ["teamcode", "playnum", "team", "opponent", "year", "playnum"]
        for col in columns:
            if col not in request.args.to_dict().keys():
                print(col)
                return Response("Missing arg: " + col, status=404)
        else:
            pass
        db.session.query(Game).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Owner_Team_Code == request.args.get("teamcode")).filter(Game.PlayNum == request.args.get("playnum")).delete()
        db.session.commit()
        return Response("Deleted Play: " + request.args.get("playnum"), status=200)
    except Exception as e:
        print(e)
        return Response(str(e), status = 500)

@utils_api.route("/endzone/rest/exportgame")
# Parameters: Team Code, Team, Opponent, Year
def Export_Game():
    try:
        columns = ["team", "opponent", "year"]
        for col in columns:
            if col not in request.args.to_dict().keys():
                print(col)
                return Response("Missing arg: " + col, status=404)
        else:
            pass
        if request.args.get("teamcode"):
            teamcode = request.args.get("teamcode")
        else:
            teamcode = current_user.team_code
        # Get Data and Export as CSV
        sql_engine = create_engine(db_uri, echo=False)
        df = pd.read_sql(db.session.query(Game).filter(Game.Owner_Team_Code == teamcode).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).order_by(asc(Game.PlayNum)).statement, sql_engine)
        export_path = os.path.dirname(__file__) + "/Exports/%s.csv" %(request.args.get("team") + "_" + request.args.get("opponent") + "_" + request.args.get("year") + "_" + str(int(time.time())))
        df.to_csv(export_path, index=False)
        return send_file(export_path, as_attachment=true)
    except Exception as e:
        print(e)
        return "Error Occured"

## TARS API