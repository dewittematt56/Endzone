from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
import pandas as pd
from Classes import Game
import sklearn.neighbors
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier

db_engine = create_engine("postgresql://postgres:BUDweiser4790!@localhost/Endzone")
# Create a session
Session = sessionmaker(db_engine)
session = Session()

df = pd.read_sql(session.query(Game).filter(Game.Possession == "LN").statement, db_engine)
df = df[["Yard", "Hash", "Down", "Distance", "Play_Type"]]

df["Play_Type"] = df["Play_Type"].replace("Boot Pass", "Pass")
df["Play_Type"] = df["Play_Type"].replace("Pocket Pass", "Pass")


# One-Hot-Encode Hash
label_encoder_hash = sklearn.preprocessing.LabelEncoder()
hash_encoded = label_encoder_hash.fit_transform(df["Hash"])
onehot_encoder = sklearn.preprocessing.OneHotEncoder(sparse=False)
hash_encoded = hash_encoded.reshape(len(hash_encoded), 1)
hash_encoded = onehot_encoder.fit_transform(hash_encoded)
hash_var = pd.DataFrame(hash_encoded, columns = ["hash" + str(int(i)) for i in range(hash_encoded.shape[1])])

df = pd.concat([df, hash_var], axis = 1)

# One-Hot-Encode Play_Type
label_encoder_playType = sklearn.preprocessing.LabelEncoder()
playTypeEncoded = label_encoder_playType.fit_transform(df["Play_Type"])


y = playTypeEncoded
x = df[["Yard", "hash0", "hash1", "hash2", "Down", "Distance"]]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=12345)

classifer = sklearn.neighbors.KNeighborsClassifier(n_neighbors=15)
classifer.fit(x_train, y_train)
print(classifer.score(x_test, y_test))

### Input Vars
yard = 32
distance = 10
down = 1
hash = "Middle"
hash0 = 0
hash1 = 0
hash2 = 0
