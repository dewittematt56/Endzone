from flask import Blueprint, send_file, request, Response, jsonify
from Endzone_Database.db import db, db_uri
from Endzone_Database.classes import Game, Formation, GameLoad
from login import user_login
from flask_login import current_user
from sqlalchemy import asc, desc, create_engine, true
from Endzone_Utils.utils import load_games_json
import pandas as pd
import os
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
# Optional Params: Team, Opponent, Year, Possession (team of interest)
def getData():
    try:
        if request.args.get("full") == "false":
            if request.args.get("possession"):
                query = db.session.query(Game).filter(Game.Possession == request.args.get("possession")).filter(Game.Owner_Team_Code == request.args.get("teamcode")).order_by(asc(Game.Opponent_Name)).order_by(desc(Game.PlayNum))
                return jsonify(load_games_json(query.all()))
            else:
                query = db.session.query(Game).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Owner_Team_Code == request.args.get("teamcode")).order_by(asc(Game.PlayNum))
                return jsonify(load_games_json(query.all()))
        else:
            query = db.session.query(Game).filter(Game.Owner_Team_Code == request.args.get("teamcode")).order_by(asc(Game.ID))
        return jsonify(load_games_json(query.all()))
    except Exception as e:
        Response(str(e), status=500)
    
@utils_api.route('/endzone/rest/addplay', methods = ["POST"])
# Parameters: Full Game Parameters
def addPlay():
    try:
        columns = ["team", "opponent", "year", "teamcode", "simplified", "playnum", "drive", "quarter", "possession", "yard", "hash", "down", "distance", "dformation", "formation", "strength", "playtype", "playdir", "passzone", "coverage", "result", "ballcarrier", "pright", "pmiddle", "pleft", "pstunt", "lat", "lon", "r_lat", "r_lon", "event"]
        for col in columns:
            if col not in request.args.to_dict().keys():
                print(col)
                return Response("Missing arg: " + col, status=404)
            else:
                pass
        # Add Play to database
        if request.args.get("event") == "Not Selected" or request.args.get("event") == None:
            event = None
        else:
            event = request.args.get("event")
        new_play = Game(request.args.get("team"), request.args.get("opponent"), request.args.get("year"), request.args.get("teamcode"), request.args.get("playnum"), request.args.get("possession"), request.args.get("yard"), request.args.get("hash"), request.args.get("down"), request.args.get("distance"), request.args.get("drive"), request.args.get("quarter"), request.args.get("dformation"), request.args.get("formation"), request.args.get("strength"),
                            request.args.get("playtype"), request.args.get("playdir"), request.args.get("passzone"), request.args.get("coverage"), request.args.get("pleft"), request.args.get("pmiddle"), request.args.get("pright"), request.args.get("result"), request.args.get("ballcarrier"), event, request.args.get("r_lat"), request.args.get("r_lon"), request.args.get("lat"), request.args.get("lon"), request.args.get("simplified"))
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
def exportGame():
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
        export_path = os.path.dirname(__file__) + "/game_exports/%s.csv" %(request.args.get("team") + "_" + request.args.get("opponent") + "_" + request.args.get("year") + "_" + str(int(time.time())))
        df.to_csv(export_path, index=False)
        return send_file(export_path, as_attachment=true)
    except Exception as e:
        print(e)
        return Response("Error Occured", 500)

@utils_api.route("/endzone/rest/deletegame")
# Parameters: Team Code, Team, Opponent, Year
def deleteGame():
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
        # Delete both
        tableLoad = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == teamcode).filter(GameLoad.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(GameLoad.Year == request.args.get("year"))
        db.session.delete(tableLoad[0])
        plays = db.session.query(Game).filter(Game.Owner_Team_Code == teamcode).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year"))
        for play in plays.all(): db.session.delete(play)
        db.session.commit()
        return "Deletion Success"
    except Exception as e:
        print(e)
        return Response("Error Occured", 500)

@utils_api.route("/endzone/rest/getgames", methods = ["GET"])
# Parameters: Teamcode Optional: Year
def getGame():
    try:
        if request.args.get("teamcode") != None:
            if request.args.get("year") == None:
                query = db.session.query(GameLoad.Team_Name, GameLoad.Opponent_Name, GameLoad.Year).filter(GameLoad.User_Team_Code == request.args.get("teamcode")).distinct().order_by(desc(GameLoad.Year))
            else:
                query = db.session.query(GameLoad.Team_Name, GameLoad.Opponent_Name, GameLoad.Year).filter(GameLoad.User_Team_Code == request.args.get("teamcode")).filter(GameLoad.Year == request.args.get("year")).distinct().order_by(desc(GameLoad.Year))
            games = []
            for game in query:
                games.append(game.Team_Name + "_" + game.Opponent_Name + "_" + str(game.Year))
            return jsonify(games)
        else:
            return Response("Please provide a team code", 404)
    except Exception as e:
        return Response(str(e), 500)

@utils_api.route("/endzone/rest/getyear", methods = ["GET"])
# Parameters: Team Code
def getYear():
    try:
        if request.args.get("teamcode") != None:
            query = db.session.query(GameLoad.Year).filter(GameLoad.User_Team_Code == request.args.get("teamcode")).distinct().order_by(desc(GameLoad.Year))
            years = [year[0] for year in query.all()]
            return jsonify(years)
        else:
            return Response("Please provide a team code", 404)
    except Exception as e:
        return Response(str(e), 500)

@utils_api.route('/endzone/rest/getunique', methods = ["GET"])
# Parameters: Team Code
def getUnique():
    try:
        query = db.session.query(Game.Possession).filter(Formation.Team_Code == current_user.team_code).distinct().order_by(asc(Game.Possession))
        possessions = []
        for form in query.all():
            possessions.append(form[0])
        return jsonify(possessions)
    except Exception as e:
        return Response(str(e), status = 404)

@utils_api.route("/endzone/rest/buildformation", methods = ["POST"])
# Parameters Team Code, Formation, WR, TE, RB
def Build_Formation():
    try:
        if request.args.get("teamcode"):
            if(request.args.get("formation")):
                query = db.session.query(Formation.Formation).filter(Formation.Team_Code == current_user.team_code).distinct().all()
                if request.args.get("formation") in [r[0] for r in query]:
                    Formation.query.filter_by(Formation = request.args.get("formation"), Team_Code = current_user.team_code).delete()
                    new_formation = Formation(request.args.get("formation"),current_user.team_code, request.form["WR"], request.form["TE"], request.form["RB"], "/Dev")
                    return Response("Formation Updated", 200)
                else:
                    new_formation = Formation(request.args.get("formation"),current_user.team_code, request.form["WR"], request.form["TE"], request.form["RB"], "/Dev")
                    db.session.add(new_formation)
                    db.session.commit()
                    return Response("Formation Created", 200)
            return Response("Please supply a formation")
        else:
            return Response("Please supply a teamcode")
    except Exception as e:
        return Response(str(e), 404)

@utils_api.route("/endzone/rest/deleteformation", methods = ["POST"])
# Parameters Team Code, Formation
def Delete_Formation():
    try:
        if request.args.get("teamcode"):
            if request.args.get("formation"):
                Formation.query.filter_by(Formation = request.args.get("formation"), Team_Code = request.args.get("teamcode")).delete()
                db.session.commit()
                return Response("Successfully deleted", 200)
            else:
                return Response("Please supply a formation")
        else:
            return Response("Please supply a teamcode")   
    except Exception as e:
        return Response(str(e), 500)
