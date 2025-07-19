import React, { useState } from 'react';
import { Layout, Typography, Row, Col, Card } from 'antd';
import SchemaBuilder from './components/SchemaBuilder';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [schemaData, setSchemaData] = useState([]);

  const handleSchemaChange = (newSchema) => {
    setSchemaData(newSchema);
  };

  const generateJSON = () => {
    const generateFieldValue = (field) => {
      // If field type is empty, don't include it in JSON
      if (!field.type || field.type.trim() === '') {
        return null;
      }

      switch (field.type) {
        case 'String':
          return 'String';
        case 'Number':
          return 'Number';
        case 'Float':
          return 'Float';
        case 'ObjectID':
          return 'ObjectID';
        case 'Boolean':
          return 'Boolean';
        case 'Nested':
          const nestedObj = {};
          field.children?.forEach(child => {
            // Only include nested fields that have a name
            if (child.name && child.name.trim() !== '') {
              const childValue = generateFieldValue(child);
              if (childValue !== null) {
                nestedObj[child.name] = childValue;
              } else {
                // Show nested field with empty value if it has no type
                nestedObj[child.name] = '';
              }
            }
          });
          return Object.keys(nestedObj).length > 0 ? nestedObj : null;
        default:
          return null;
      }
    };

    const jsonObject = {};
    schemaData.forEach(field => {
      // Only include fields that have a name
      if (field.name && field.name.trim() !== '') {
        const fieldValue = generateFieldValue(field);
        if (fieldValue !== null) {
          jsonObject[field.name] = fieldValue;
        }
      }
    });
    
    return JSON.stringify(jsonObject, null, 2);
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Header style={{ background: '#fff', padding: '0 24px', width: '100%' }}>
        <Title level={2} style={{ margin: '16px 0', color: '#1890ff' }}>
          JSON Schema Builder
        </Title>
      </Header>
      <Content style={{ padding: '24px', width: '100%' }}>
        <Row gutter={24} style={{ height: 'calc(100vh - 120px)', width: '100%' }}>
          <Col span={12} style={{ width: '50%' }}>
            <Card title="Schema Definition" style={{ height: '100%', width: '100%' }}>
              <SchemaBuilder 
                schemaData={schemaData} 
                onSchemaChange={handleSchemaChange} 
              />
            </Card>
          </Col>
          <Col span={12} style={{ width: '50%' }}>
            <Card title="JSON Preview" style={{ height: '100%', width: '100%' }}>
              <div style={{ 
                background: '#f6f8fa', 
                padding: '16px', 
                borderRadius: '6px',
                height: 'calc(100% - 60px)',
                overflow: 'auto',
                width: '100%'
              }}>
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  width: '100%'
                }}>
                  {generateJSON()}
                </pre>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
