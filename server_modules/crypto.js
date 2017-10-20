var crypto = require('crypto');





function encrypt(reqBody, res){
	console.log('inside the crypto server module, and its time for bed')
	console.log(reqBody)

	var key = reqBody.privKey
	var text = reqBody.msg
	var cipher = reqBody.cipher
	var enc = crypto.createCipher(cipher, key).update(text, "utf-8", "hex")

	var dec = crypto.createDecipher(cipher, key).update(enc, "hex", "utf-8")

	console.log(enc)
	console.log(dec)
	res.send({
		enc:enc,
		dec:dec
	})
}

function decrypt(reqBody, res){
	console.log('inside the crypto server module, and its time for bed')
	console.log(reqBody)

	var key = reqBody.privKey
	var text = reqBody.msg
	var cipher = reqBody.cipher
	// var enc = crypto.createCipher(cipher, key).update(text, "utf-8", "hex")

	var dec = crypto.createDecipher(cipher, key).update(text, "hex", "utf-8")

	// console.log(enc)
	console.log(dec)
	res.send({
		enc:text,
		dec:dec
	})
}

function hash(reqBody, res){
	console.log(reqBody )
	var type = reqBody.type
	var msg = reqBody.msg
	var algo = reqBody.hashAlgo
	var hash = crypto.createHash(algo);
	hash.update(msg)
	hash = hash.digest('hex')

	res.send({
		hash:hash,
		msg:msg
	})


}

module.exports={
	encrypt:encrypt,
	decrypt:decrypt,
	hash:hash
}