import bcrypt from "bcryptjs"

const password = "mumuzz7447"
const hash = bcrypt.hashSync(password, 10)

console.log(hash)
