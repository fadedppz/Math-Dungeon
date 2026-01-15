function ProblemDisplay({ problem, onSelectOption }) {
  if (!problem) return (
    <div style={{
      background: 'rgba(30, 30, 50, 0.9)',
      padding: '30px',
      borderRadius: '12px',
      border: '2px solid #667eea',
      textAlign: 'center',
      color: '#aaa'
    }}>
      No problem available
    </div>
  )

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
      padding: '25px',
      borderRadius: '12px',
      border: '2px solid #667eea',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Problem header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          color: '#667eea',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Math Problem
        </div>
        <div style={{
          background: 'rgba(102, 126, 234, 0.2)',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#667eea'
        }}>
          {problem.topic || 'General'}
        </div>
      </div>
      
      {/* Question */}
      <h3 style={{ 
        color: '#fff', 
        marginBottom: '20px', 
        fontSize: '24px',
        lineHeight: '1.4',
        fontWeight: 'normal'
      }}>
        {problem.question}
      </h3>
      
      {/* Multiple choice options */}
      {problem.type === 'multiple-choice' && problem.options && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '20px'
        }}>
          {problem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectOption && onSelectOption(option.value)}
              style={{
                padding: '15px 20px',
                textAlign: 'left',
                background: 'rgba(102, 126, 234, 0.15)',
                border: '2px solid rgba(102, 126, 234, 0.4)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.3)'
                e.target.style.borderColor = '#667eea'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.15)'
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)'
              }}
            >
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {option.label}
              </span>
              <span>{option.value}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Fill in blank hint */}
      {problem.type === 'fill-in-blank' && (
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '14px',
          marginTop: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(78, 205, 196, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            💡
          </span>
          Type your answer in the input field below and press Enter or click Attack
        </div>
      )}
    </div>
  )
}

export default ProblemDisplay
