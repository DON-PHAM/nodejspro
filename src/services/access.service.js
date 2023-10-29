'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER', // 0001
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            //Step1: check email exists??
            const emailShop = await shopModel.findOne({email}).lean()
            if(emailShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles : [RoleShop.SHOP]
            })

            if(newShop) {
                // created privateKey, publicKey
                // this is lv3
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // pkcs8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                //this is lve1
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({ privateKey, publicKey }, "public and privateKey") // save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'Shop already registered!'
                    }
                }

                const tokens = await createTokenPair({userId: newShop._id,email}, publicKey, privateKey)
                console.log(tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object:newShop }),
                        tokens
                    }
                }

            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: '401',
                message: error.message,
                status: 'message'
            }
        }
    }
}

module.exports =  AccessService