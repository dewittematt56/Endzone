from flask import Flask, render_template, request, redirect, send_file, jsonify
from flask_login import login_manager, LoginManager, login_required, login_user, logout_user, current_user
from login import user_login
from Endzone_Database.classes import User, GameLoad, Team, Game, Formation, Model
from Endzone_Database.db import db, db_uri
from Endzone_Utils.utils import *
from Endzone_API.utils_api import utils_api
from Endzone_API.tools_api import tools_api

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.secret_key = "jSY8ov4if99WKAFlDOg3"

app.register_blueprint(utils_api)
app.register_blueprint(tools_api)

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

@app.route("/jointeam")
def NewUser():
    return render_template("JoinTeam.html")

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
    try:
        email = request.form["email"]
        password = request.form["password"]

        response = db.session.query(User).filter(User.Email == email). \
            filter(User.Password == password)
        if len(response.all()) == 1:
            login_user(load_user(request.form["email"]))
            return redirect("/endzone/hub")

        response = db.session.query(User).filter(User.Email == email)
        if len(response.all()) == 0:
            return render_template("Login.html", message = "Login Failed: No account with that email exists")
        else:
            return render_template("Login.html", message = "Login Failed: Incorrect Password")
    except Exception as e:
        print(e)
        return render_template("Login.html", message = "Login Failed: An error has occured")

@app.route("/Logout")
@login_required
def logout():
    logout_user()
    return redirect("/")

@app.route("/endzone/hub")
@login_required
def Hub():
    return render_template("Hub.html", User = "Coach " + current_user.last)

@app.route("/endzone/gamemanagement")
@login_required
def GameManagement():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    return render_template("GameManagement.html", User = "Coach " + current_user.last, Games = games)

@app.route("/endzone/game", methods = ["POST", "GET"])
@login_required
def GameData():
    try:
        # Check if Game Exists
        query_response = db.session.query(GameLoad).filter(GameLoad.Team_Name == request.form["team"]).filter(GameLoad.Opponent_Name == request.form["opponent"]).filter(GameLoad.Year == int(request.form["year"])).filter(GameLoad.User_Team_Code == current_user.team_code)
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
        redirect("/endzone/gamemanagement")

@app.route("/endzone/dashboard", methods = ["POST", "GET"])
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
        return redirect("/endzone/game")

@app.route("/endzone/prereport", methods = ["POST", "GET"])
@login_required
def prereport():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    query_response = db.session.query(Game.Possession).filter(Game.Owner_Team_Code == current_user.team_code).distinct().order_by(asc(Game.Possession))
    teams = query_response.all()
    return render_template("PreReport.html", Team_Code = current_user.team_code, User = "Coach " + current_user.last)


@app.route("/endzone/tars", methods = ["POST", "GET"])
@login_required
def TARS():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()

    query_response = db.session.query(Game.Possession).filter(Game.Owner_Team_Code == current_user.team_code).distinct().order_by(asc(Game.Possession))
    teams_of_interest = query_response.all()
    return render_template("TARS.html", User = "Coach " + current_user.last, Games = games, Teams = teams_of_interest)

@app.route("/endzone/dataviewer", methods = ["POST", "GET"])
@login_required
def DataViewer():
    return render_template("DataViewer.html", Team_Code = current_user.team_code, User = "Coach " + current_user.last)

@app.route("/endzone/driveanalyzer", methods = ["GET"])
@login_required
def DriveAnalyzer():
    query_response = db.session.query(GameLoad).filter(GameLoad.User_Team_Code == current_user.team_code).order_by(asc(GameLoad.Team_Name))
    games = query_response.all()
    return render_template("DriveAnalyzer.html", User = "Coach " + current_user.last, Games = games)

@app.route("/endzone/driveanalyzer/getparam", methods = ["GET"])
@login_required
def DriveAnalyzer_GetParam():
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
@app.route("/endzone/driveanalyzer/getdata", methods = ["GET"])
@login_required
def DriveAnalyzer_GetData():
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

@app.route("/endzone/formations", methods = ["GET"])
@login_required
def Formations():
    query_response = db.session.query(Formation).filter(Formation.Team_Code == current_user.team_code).order_by(asc(Formation.Formation))
    return render_template("Formations.html", User = "Coach " + current_user.last, Formations = query_response.all(), teamcode = current_user.team_code)

@app.route("/endzone/gamerecap", methods = ["GET"])
@login_required
def GameRecap():
    return render_template("PostGameReport.html", Team_Code = current_user.team_code, User = "Coach " + current_user.last)

if __name__ == '__main__':
    app.run(use_reloader = True, host = "0.0.0.0", debug=True, port = 80)