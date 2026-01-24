/** @jsxImportSource @emotion/react */
import { useFormStatus } from 'react-dom'
import { buttonStyles } from './SubmitButton.styled'

interface SubmitButtonProps {
  label?: string
  pendingLabel?: string
  disabled?: boolean
}

export function SubmitButton({
  label = 'Submit',
  pendingLabel = 'Submitting...',
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending || disabled} css={buttonStyles}>
      {pending ? pendingLabel : label}
    </button>
  )
}
