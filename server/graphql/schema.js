exports.typeDefs = `

    type User {
        uid: Int
        password: String!
        bio: String
        profileImage: String
        email: String!
        userName: String!
        createdAt: String
        updatedAt: String
    }

    type Token {
        token: String!
    }

    type Query {
        
        getCurrentUser: User

        getUserProfile: User

        getAllUsers: [User]

        profilePage(userName: String!): User

    }

    type Mutation {

        signupUser(email: String!, userName: String!, password: String!): Token

        signinUser(email: String!, password: String!): Token

        editProfile(email: String!, bio: String!): User

        setProfileIMG(email: String!, profileImage: String!): User
        
        changeEmail(currentEmail: String!, newEmail: String!): User

        changePassword(email: String!, password: String!): User

        passwordReset(email: String!): User

    }




`;