import { RouterProvider } from 'react-router'

import { AppProviders } from './core/providers'
import { router } from './core/router'

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
