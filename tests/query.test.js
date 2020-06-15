const gql = require('graphql-tag')
const createTestServer = require('./helper')
const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`

describe('queries', () => {
  test('feed', async () => {
    const {query} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          findMany: jest.fn(() => [{id: 1, message: 'hello', createdAt: 12345839, likes: 20, views: 300}])
        }
      }
    })

    const res = await query({query: FEED})
    expect(res).toMatchSnapshot()
  })

  test('userSettings', async () => {
    const USER_SETTINGS = gql`
      query getUserSettings {
        userSettings {
          id
          user {
            id
          }
          emailNotifications
        }
      }
    `;
    const {query} = createTestServer({
      user: {id: 15},
      models: {
        User: {
          findOne: jest.fn(() => ({
            id: 15,
            email: "a@a.com",
            avatar: "www.avatar.com",
            verified: true,
            createdAt: "12312312313",
            posts: [],
            role: "ADMIN",
            settings: '23'
          }))
        },
        Settings: {
          findOne: jest.fn(({id, user}) => ({
            id,
            user: {id: user}
          }))
        }
      }
    })

    const result = await query({query: USER_SETTINGS});
    const resultJSON = JSON.parse(JSON.stringify(result.data));
    expect(resultJSON.userSettings.user.id).toEqual('15');
  })
})
// userSettings: authenticated((_, __, {user, models}) => {
//       return models.Settings.findOne({user: user.id})
//     }),
//   User: {
//     posts(root, _, {user, models}) {
//       if (root.id !== user.id) {
//         throw new Error('nope')
//       }

//       return models.Post.findMany({author: root.id})
//     },
//     settings(root, __, {user, models}) {
//       return models.Settings.findOne({id: root.settings, user: user.id})
//     }
//   },
//   Settings: {
//     user(settings, _, {user, models}) {
//       return models.User.findOne({id: settings.id, user: user.id})
//     }