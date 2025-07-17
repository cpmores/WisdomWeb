import {http, HttpResponse} from 'msw'

export const handlers = [
    http.post('http://localhost:8080/api/users/login', (req, res, ctx) => {
        return HttpResponse.json({
          success: true,
          user: {
            id: 1,
            userId: 1,
            username: 'John Doe',
            email: '123@123.com',
            avatar: '',
            isVerified: true,
            isActive: true,
            isOnline: true,
          },
          bookmarks: [
            {
              tag: 'test',
              bookmarks: [
                {
                  url: 'https://www.google.com',
                  tag: 'Google',
                  click_count: 100,
                  created_at: new Date().toISOString(),
                },
                {
                  url: 'https://www.runoob.com/',
                  tag: 'noob',
                  click_count: 10,
                  created_at: new Date().toISOString(),
                },
              ],
            },
          ],
        })
    })
]
