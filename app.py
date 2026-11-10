
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re




flask_app = Flask(__name__) #creates a flask application object that creates a server when the app runs. It also creates a url that the server listens to 
# CORS(
#     flask_app,
#     resources={
#         r"/contributions/.*": {
#             "origins": ["http://127.0.0.1:5500"]
#         }
#     }
# )

CORS(flask_app) # cross origin resource sharing - allows flask server to permit the cross origin request that js is making (js and flask use different url ports which flags the 'same origin policy)
@flask_app.route("/contributions/<username>") #adds a route to the server url - so js will send an http request to that url, flask takes the username out of that url and use it to run the function




def get_contributions(username):

    url = f"https://github.com/users/{username}/contributions"
    # url = f"https://github.com/{username}"

    response = requests.get(url)
    # print(response.status_code)
    # print(response.url)
    # print(len(response.content))
    

    soup = BeautifulSoup(response.content, "html.parser")
    # print(soup)

    dates_and_levels = soup.find_all("td", class_="ContributionCalendar-day")
    # print(soup.title)
    # print(len(dates_and_levels))
    # print(response.text.find("contribution-day-component"))

    yearly_contributions = []

    for element in dates_and_levels:

        daily_contribution_count = {}

        # label_text = soup.find("tool-tip", id=f"{element.get('aria-labelledby')}")

        label_text = soup.find("tool-tip", attrs={"for": element.get("id")})

        if label_text is None:
            contribution_count = None
            
        else:
            if label_text.get_text(strip=True).startswith("No"):
                contribution_count = 0

            else:
                label_text = label_text.get_text(strip=True)

                match = re.search(r'(\d+(?:,\d+)?)\s.+', label_text)
                contribution_count = None if match is None else int(match.group(1).replace(",", ""))

                # contribution_count = int(re.search(r'(\d+(?:,\d+)?)\s.+', label_text).group(1).replace(",", "")) 


        daily_contribution_count = {
            "date": element.get("data-date"),
            "level": int(element.get("data-level")),
            "contribution_count": contribution_count

        }

        yearly_contributions.append(daily_contribution_count)

    return jsonify(yearly_contributions)

    
flask_app.run() # telling python to run the application





