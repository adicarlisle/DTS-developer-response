export default function ApiDocs() {
    const apiDocsUrl = 'http://localhost:8000';
    
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <h1>API Documentation</h1>
            <iframe 
                src={`${apiDocsUrl}/docs`}
                style={{
                    width: '100%',
                    height: 'calc(100vh - 100px)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                title="API Documentation"
            />
        </div>
    );
}