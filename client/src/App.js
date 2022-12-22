import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register, Landing, Error, ProtectedRoute } from './pages'
import {
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob,
} from './pages/dashboard'
// 跨域 加一个proxy 5000
function App() {
  return (
    <BrowserRouter>
    {/* 下面是所有的路径 */}
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              {/* 得先确定有登陆身份 protectedroute */}
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* stats是一个index page 就是为了到一个斜杠 要不就啥也没有 */}
          <Route index element={<Stats />} />
          {/* 下面都是斜杠后面加的path */}
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
