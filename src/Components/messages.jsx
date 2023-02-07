import { gql, useSubscription } from '@apollo/client'
import { useState } from 'react'

const MESSAGES_SUBSCRIPTION = gql`
    subscription MessageCreated {
        messageCreated{
            text
            createdBy
        }
    }
`

export const Messages = () => {
  const [comments, setComments] = useState([])

  const { data, loading } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    {
      onSubscriptionData: (data) => {
        const message = data.subscriptionData.data.messageCreated
        setComments(comments => [...comments, message])
      }
    }
  )

  const listItems = comments.map((comment, index) =>
    <li key={index}>
      <p>
        <strong>{comment.createdBy}</strong> says {comment.text}
      </p>
    </li>
  )

  return (
    <div>
      <ul>

        {listItems}
      </ul>
    </div>
  )
}
