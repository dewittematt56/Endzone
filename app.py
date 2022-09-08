from flask import *
from flask_login import login_manager, LoginManager, login_required, login_user, logout_user, current_user
from sqlalchemy import *
from login import user_login
from classes import *
from db import db, db_uri
from KIPP import Run_Kip
from utils import *
from utils_api import utils_api

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.secret_key = "jSY8ov4if99WKAFlDOg3"
app.debug = True

app.register_blueprint(utils_api)
db.init_app(app)

# Build DB if not existing
with app.app_context():
    db.create_all()

# Setup login system
login_manager = LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(email):
    query = db.session.query(User).filter(User.Email == email)
    query_response = query.all()
    loaded_user = user_login(query_response[0].First_Name, query_response[0].Last_Name, query_response[0].Email, query_response[0].Password, query_response[0].Team_Code, query_response[0].Access, query_response[0].IS_Reviewed)
    return loaded_user

@app.route("/")
def Home():
    return render_template("Home.html")

@login_manager.unauthorized_handler
def no_login_redirect():
    return redirect("/Login")

# Render Page
@app.route("/jointeam")
def NewUser():
    return render_template("JoinTeam.html")
# Join Team
@app.route("/jointeam/join", methods = ["POST"])
def Join():
    first = request.form["first"]
    last =  request.form["last"]
    email = request.form["email"]
    password = request.form["password"]
    teamcode = request.form["teamcode"]
    try:
        # Check Email
        response = db.session.query(User).filter(User.Email == email)
        if len(response.all()) > 0:
            return render_template("JoinTeam.html", message = "Unable to Join Team: An account with that email already exists")

        # Check Team Code
        response = db.session.query(Team).filter(Team.Team_Code == teamcode)
        if len(response.all()) == 1:
            new_user = User(first, last, email, password, teamcode, "Requested", 0)
            db.session.add(new_user)
            db.session.commit()
        else:
            return render_template("JoinTeam.html", message = "Unable to Join Team: No matching team code.")
    except Exception as e:
        print(e)
        return render_template("JoinTeam.html", message = str(e))



    return redirect("/Login")

@app.route("/Login")
def Login():
    return render_template("Login.html")

@app.route("/LoginAttempt", methods = ["POST"])
def LoginAttempt():
    email = request.form["email"]
    password = request.form["password"]

    response = db.session.query(User).filter(User.Email == email). \
        filter(User.Password == password)
    if len(response.all()) == 1:
        login_user(load_user(request.form["email"]))
        return redirect("/Endzone/Hub")

    response = db.session.query(User).filter(User.Email == email)
    if len(response.all()) == 0:
        return render_template("Login.html", message = "Login Failed: No account with that email exists")
    else:
        return render_template("Login.html", message = "Login Failed: Incorrect Password")

@app.route("/Logout")
@login_required
def logout():
    logout_user()
    return redirect("/")

@app.route("/Endzone/Hub")
@login_required
def Hub():
    return render_template("Hub.html", User = "Coach " + current_user.last)

@app.route("/Endzone/GameManagement")
@login_required
def GameManagement():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    return render_template("GameManagement.html", User = "Coach " + current_user.last, Games = games)

@app.route("/Endzone/Game", methods = ["POST", "GET"])
@login_required
def GameData():
    try:
        # Check if Game Exists
        query_response = db.session.query(GameLoad).filter(GameLoad.Team_Name == request.form["team"]).filter(GameLoad.Opponent_Name == request.form["opponent"]).filter(GameLoad.Year == int(request.form["year"])).filter(GameLoad.User_Team_Code == current_user.team_code)
        # If exists pass on
        if len(query_response.all()) == 1:
            year = query_response[0].Year
            team = query_response[0].Team_Name
            opponent = query_response[0].Opponent_Name
            team_code = query_response[0].User_Team_Code
        # If not create record, pass on
        elif len(query_response.all()) == 0:
            year = int(request.form["year"])
            team = request.form["team"]
            team = team.replace("_", "-")
            opponent = request.form["opponent"]
            opponent = opponent.replace("_", "-")
            team_code = current_user.team_code
            new_game = GameLoad(team, opponent, team_code, year)
            db.session.add(new_game)
            db.session.commit()
        # Get Data
        past_plays = reload_plays(request.form["team"], request.form["opponent"], current_user.team_code, int(request.form["year"]))
                    
        # If no plays exist, default data
        if len(past_plays) == 0:
            past_plays = [{"PlayNum": 0, "Down": 1, "Distance": 10, "Hash": 'Middle', "Drive": 1, "Quarter": 1, "Yard": 20, "D_Formation": "3-4", "Result_Lat": 2, "Result_Lon": 5, "Possession": team}]
        meta_payload = {"team": team, "opponent": opponent, "team_code": team_code, "year": year, "simplified": "false"}
        return render_template("Game.html", User = "Coach " + current_user.last, metadata = meta_payload, plays = past_plays)
    except Exception as e:
        print(e)
        redirect("/Endzone/GameManagement")

@app.route("/Endzone/Dashboard", methods = ["POST", "GET"])
@login_required
def Dashboard():
    try: 
        if request.form.get("game_dash") != "":
            user_input = request.form.get("game_dash").split(',')
            team = []
            opponent = []
            year = []
            for input in user_input:
                temp = input.split("_")
                team.append(temp[0])
                opponent.append(temp[1])
                year.append(temp[2])
            if request.form["action_dash"] == "load_dashboard":
                query_response = db.session.query(Game).filter(Game.Owner_Team_Code == current_user.team_code).filter(Game.Team_Name.in_(team)).filter(Game.Opponent_Name.in_(opponent)).filter(Game.Year.in_(year)).all()
                json = load_games_json(query_response)
        else:
            query_response = db.session.query(Game).filter(Game.Owner_Team_Code == current_user.team_code).all()
            json = load_games_json(query_response)  
        return render_template("Dashboard.html", User = "Coach " + current_user.last, payload = json)
    except Exception as e:
        print(e)
        return redirect("/Endzone/Game")

@app.route("/Endzone/KIPP", methods = ["POST", "GET"])
@login_required
def KIPP():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    query_response = db.session.query(Game.Possession).filter(Game.Owner_Team_Code == current_user.team_code).distinct().order_by(asc(Game.Possession))
    teams = query_response.all()
    return render_template("KIPP.html", User = "Coach " + current_user.last, Games = games, Teams = teams)

@app.route("/Endzone/KIPP/Run", methods = ["POST", "GET"])
@login_required
def KIPP_Run():
    try:
        if request.method == "POST":
            if request.form["kipps_action"] == "run_kipps":
                user_input = request.form["kipps_jobs"].split(',')
                team_of_interest = request.form["TeamOfInterest"]
                if len(user_input) == 1 and user_input[0] == "":
                    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).filter(or_(GameLoad.Team_Name == team_of_interest,  GameLoad.Opponent_Name == team_of_interest))
                    for game in query_response.all():
                        user_input.append(game.Team_Name + "_" + game.Opponent_Name + "_" + str(game.Year))
            return send_file(Run_Kip(user_input, team_of_interest, current_user.team_code, "Defense"), as_attachment=True)
        else:
             return redirect("/Endzone/KIPP")
    except Exception as e:
        print(e)
        return redirect("/Endzone/KIPP")

@app.route("/Endzone/TARS", methods = ["POST", "GET"])
@login_required
def TARS():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()

    query_response = db.session.query(Game.Possession).filter(Game.Owner_Team_Code == current_user.team_code).distinct().order_by(asc(Game.Possession))
    teams_of_interest = query_response.all()
    return render_template("TARS.html", User = "Coach " + current_user.last, Games = games, Teams = teams_of_interest)

@app.route("/Endzone/TARS/Run", methods = ["GET"])
@login_required
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
        print(group_by)
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

@app.route("/Endzone/CASE", methods = ["POST", "GET"])
@login_required
def CASE():
    return render_template("CASE.html")

@app.route("/Endzone/DAT", methods = ["GET"])
@login_required
def DAT():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    return render_template("DAT.html", User = "Coach " + current_user.last, Games = games)

@app.route("/Endzone/DAT/GetParam", methods = ["GET"])
@login_required
def Dat_GetParam():
    try:
        if request.args.get("team") != null:
            if request.args.get("opponent") != null:
                if request.args.get("year") != null:
                    if request.args.get("possession") != null:
                        query_response = db.session.query(Game.Drive, Game.Possession).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Possession == request.args.get("possession")).distinct().order_by(asc(Game.Drive))
                        drives = query_response.all()
                        drives = [drive[0] for drive in drives]
                        return str(drives)
    except Exception as e:
        print(e)
        return ""

## TO-DO: Move to utilites API
@app.route("/Endzone/DAT/GetData", methods = ["GET"])
@login_required
def Dat_GetData():
    try:
        if request.args.get("team") != null:
            if request.args.get("opponent") != null:
                if request.args.get("year") != null:
                    if request.args.get("drive") != null:
                        query_response = db.session.query(Game, Formation).join(Formation, Game.Formation == Formation.Formation).filter(Game.Team_Name == request.args.get("team")).filter(Game.Opponent_Name == request.args.get("opponent")).filter(Game.Year == request.args.get("year")).filter(Game.Drive == request.args.get("drive")).order_by(asc(Game.PlayNum))
                        json_payload = load_games_formations_json(query_response.all())
                        return jsonify(json_payload)
    except Exception as e:
        print(e)
        return ""

@app.route("/Endzone/Formations", methods = ["GET"])
@login_required
def Formations():
    query_response = db.session.query(Formation).filter(Formation.Team_Code == current_user.team_code).order_by(asc(Formation.Formation))
    return render_template("Formations.html", User = "Coach " + current_user.last, Formations = query_response.all())

## TO-DO: Move to utilites API
@app.route("/Endzone/Formations/Build", methods = ["POST"])
@login_required
def Build_Formation():
    try:
        if(request.form.get("Formation")):
            query = db.session.query(Formation.Formation).filter(Formation.Team_Code == current_user.team_code).distinct().all()
            if request.form["Formation"] in [r[0] for r in query]:
                Formation.query.filter_by(Formation = request.form["Formation"], Team_Code = current_user.team_code).delete()
                new_formation = Formation(request.form["Formation"],current_user.team_code, request.form["WR"], request.form["TE"], request.form["RB"], "/Dev")
                return redirect("/Endzone/Formations")
            else:
                new_formation = Formation(request.form["Formation"],current_user.team_code, request.form["WR"], request.form["TE"], request.form["RB"], "/Dev")
                db.session.add(new_formation)
                db.session.commit()
        return redirect("/Endzone/Formations")
    except Exception as e:
        print(e)
        return redirect("/Endzone/Formations")

## TO-DO: Move to utilites API
@app.route("/Endzone/Formations/Delete", methods = ["POST"])
@login_required
def Delete_Formation():
    try:
        formation = request.args.get("Formation")
        Formation.query.filter_by(Formation = formation, Team_Code = current_user.team_code).delete()
        db.session.commit()
        return "200"
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(use_reloader = True, host = "0.0.0.0", debug=True)