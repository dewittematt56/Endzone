from flask_login import UserMixin

## Model class for a user, used in login work.
class user_login(UserMixin):
    def __init__(self, first, last, email, password, team_code, access, is_reviewed):
         self.first = first
         self.last = last
         self.email = email
         self.password = password
         self.team_code = team_code
         self.access = access
         self.is_reviewed = is_reviewed
    def is_active(self):
         return self.is_active()
    def is_anonymous(self):
         return False
    def is_authenticated(self):
         return self.authenticated
    def is_active(self):
         return True
    def get_id(self):
         return self.email