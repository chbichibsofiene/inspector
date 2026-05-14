import urllib.request
import urllib.error
import json

base = "http://localhost:8080/api"

def get(url, token):
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + token})
    return json.loads(urllib.request.urlopen(req).read())

def post(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method="POST")
    try:
        return json.loads(urllib.request.urlopen(req).read()), None
    except urllib.error.HTTPError as e:
        return None, e.code

print("=== 1. Admin login to fetch lookup IDs ===")
admin_req = urllib.request.Request(base + "/auth/login", data=json.dumps({"email": "admin@inspector.tn", "password": "Admin@2024"}).encode(), headers={"Content-Type": "application/json"}, method="POST")
admin_token = json.loads(urllib.request.urlopen(admin_req).read())["data"]["token"]

delegations = get(base + "/inspector/profile/delegations", admin_token)["data"]
del_id = delegations[0]["id"]
dep_id = get(base + "/inspector/profile/dependencies?delegationId=" + str(del_id), admin_token)["data"][0]["id"]
etab_id = get(base + "/inspector/profile/etablissements?dependencyId=" + str(dep_id), admin_token)["data"][0]["id"]
print(f"Using delegation={del_id}, dependency={dep_id}, etablissement={etab_id}")

print("=== 2. Register Teacher ===")
res, err = post(base + "/auth/register", {"email": "teacher1@test.tn", "password": "Password@123", "serialCode": "TCH-001"})
if res:
    print("Registered teacher. Awaiting manual activation in DB.")
else:
    print(f"Teacher probably already registered. err={err}")

print("=== 3. Activating teacher directly via DB command should be done here if possible")
