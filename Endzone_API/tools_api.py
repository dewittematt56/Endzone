from flask import Blueprint, send_file, request, Response, redirect
from Endzone_Database.db import db
from Endzone_Database.classes import  GameLoad
from Endzone_Reports.post_game import run_post_report
from Endzone_Reports.pre_game import run_pre_report
from flask_login import current_user
from sqlalchemy import or_

tools_api = Blueprint("Tools", __name__)

# Post Game Report
@tools_api.route('/endzone/rest/tools/recapreport', methods = ["GET"])
def RecapReport():
    try:
        if request.args.get("teamcode") != None:
            if request.args.get("input") != None:
                return send_file(run_post_report(request.args.get("input"), request.args.get("teamcode")), as_attachment=True)
            else:
                Response("Please supply a input", 404)
        else:
            Response("Please supply a valid team code", 404)
    except Exception as e:
        return Response(str(e), 500)

# Pre Game Report
@tools_api.route("/endzone/rest/tools/prereport", methods = ["POST", "GET"])
def prereport_run():
    try:
        if request.method == "POST":
            if request.form["kipps_action"] == "run_kipps":
                user_input = request.form["kipps_jobs"].split(',')
                team_of_interest = request.form["TeamOfInterest"]
                job_type = request.form["kipps_type"]
                if len(user_input) == 1 and user_input[0] == "":
                    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).filter(or_(GameLoad.Team_Name == team_of_interest,  GameLoad.Opponent_Name == team_of_interest))
                    for game in query_response.all():
                        user_input.append(game.Team_Name + "_" + game.Opponent_Name + "_" + str(game.Year))
                    # Run Report
            return send_file(run_pre_report(user_input, team_of_interest, current_user.team_code, job_type), as_attachment=True)
        else:
             return redirect("/endzone/prereport")
    except Exception as e:
        print(e)
        return redirect("/endzone/prereport")

@tools_api.route("/endzone/rest/tools/tars/run", methods = ["GET"])
def TARS_Run():
    try:
        team = []
        opponent = []
        year = []
        down = request.args.get("down")
        group_by = ['sub."Play_Type"']

        if down == "No Filter":
            down = '"Down"'
        else:
            down = "'" + down + "'"
            group_by.append('"Down"')
        distance = request.args.get("distance")
        if distance == "No Filter":
            distance = 'sub."Distance_Roll"'
        else: 
            distance = "'" + distance + "'"
            group_by.append('sub."Distance_Roll"')

        yard = request.args.get("yard")
        if yard == "No Filter":
            yard = 'sub."Yard_Roll"'
        else:
            yard = "'" + yard + "'"
            group_by.append('sub."Yard_Roll"')
        
        hash = request.args.get("hash")
        if hash == "No Filter":
            hash = 'sub."Hash"'
        else:
            hash = "'" + hash + "'"
            group_by.append('sub."Hash"')

        games = request.args.get("games").split(',')
        possession = "'" + request.args.get("possession") + "'"
        if games[0] == "":
            team = '"Team_Name"'
            opponent = '"Opponent_Name"'
            year = '"Year"'
        else:
            for game in games:
                temp = game.split("_")
                team.append("'" + temp[0] + "'")
                opponent.append("'" + temp[1] + "'")
                year.append(temp[2])
            team = ",".join(team)
            opponent = ",".join(opponent)
            year = ",".join(year)
        group_by = ", ".join(group_by)
        response = db.session.execute("""SELECT sub."Play_Type", ROUND((COUNT(*) * 100.0/ sum(count(*)) over ()), 3) as "Total", count(*)
                                            FROM (
                                                SELECT
                                                "Play_Type",
                                                "Play_Type_Dir",
                                                "Down",
                                                "Hash",
                                                CASE 
                                                    WHEN "Distance" <= 3 THEN 'Short'
                                                    WHEN "Distance" > 3 AND "Distance" <7 THEN 'Medium'
                                                    WHEN "Distance" > 7 THEN 'Long'
                                                    ELSE 'Unknown'
                                                END AS "Distance_Roll",
                                                CASE
                                                    WHEN "Yard" > 66 THEN 'Scoring Position'
                                                    WHEN "Yard" < 66 AND "Yard" > 33 THEN 'Midfield'
                                                    WHEN "Yard" < 33 THEN 'Backed Up'
                                                END AS "Yard_Roll"
                                                FROM public."Game"
                                                WHERE "Team_Name" IN (%s)
                                                AND "Opponent_Name" IN (%s)
                                                AND "Year" IN (%s)
                                                AND "Possession" = %s
                                            ) as sub
                                                WHERE "Down" = %s
                                                AND sub."Distance_Roll" = %s
                                                AND sub."Yard_Roll" = %s
                                                AND sub."Hash" = %s
                                            GROUP BY %s
                                            ORDER BY "Total" DESC
                                        """ % (team, opponent, year, possession, down, distance, yard, hash, group_by)) 
        responses = response.all()
        TARS_Response = ""
        for response in responses:
            TARS_Response += "TARS-Response: "
            TARS_Response += str(response[0]) + " | " + str(response[1]) + "% | " + str(response[2]) + "\n"
        return TARS_Response
    except IndexError:
        return "TARS-Response: Unable to find data for those parameters"
    except Exception as e:
        print(e)
        return "TARS-Response: An error has occured"
