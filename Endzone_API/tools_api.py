from flask import Blueprint, send_file, request, Response, jsonify
from Endzone_Database.db import db, db_uri
from Endzone_Database.classes import Game, Formation, GameLoad
from Endzone_Reports.post_game import run_report
from login import user_login
from flask_login import current_user
from sqlalchemy import asc, desc, create_engine, true
from Endzone_Utils.utils import load_games_json
import pandas as pd
import os
import time

tools_api = Blueprint("Tools", __name__)

# Tars

# Report

# Post-Game
@tools_api.route('/endzone/rest/tools/recapreport', methods = ["GET"])
def RecapReport():
    try:
        if request.args.get("teamcode") != None:
            if request.args.get("input") != None:
                return send_file(run_report(request.args.get("input"), request.args.get("teamcode")), as_attachment=True)
            else:
                Response("Please supply a input", 404)
        else:
            Response("Please supply a valid team code", 404)
    except Exception as e:
        return Response(str(e), 500)