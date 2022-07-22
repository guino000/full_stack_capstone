import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import jwt_decode from "jwt-decode";

export default withApiAuthRequired(async function getUserRoles(req, res) {
  try {
    if (req.method === 'GET') {
      const session = getSession(req, res)
      console.log(session?.idToken)
      const payload = jwt_decode(session?.idToken || '')
      console.log(payload)
      res.json({idToken: session?.idToken})
      res.status(200).end()
    } else {
      res.status(405).end()
    }
  } catch (error) {
    console.log(error)
    // @ts-ignore
    res.status(400).end(error.toString())
  }
})
