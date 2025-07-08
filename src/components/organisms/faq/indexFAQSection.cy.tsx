import React from 'react'
import FAQSection from './index'

describe('<FAQSection />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<FAQSection />)
  })
})