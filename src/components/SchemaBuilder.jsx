import React, { useState } from 'react';
import { Button, Input, Select, Switch, Space, Row, Col } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const SchemaBuilder = ({ schemaData, onSchemaChange }) => {
  const [showFieldInput, setShowFieldInput] = useState(false);
  const [currentField, setCurrentField] = useState({
    name: '',
    type: '',
    required: false
  });

  const handleAddItem = () => {
    setShowFieldInput(true);
  };

  const handleCancelField = () => {
    setShowFieldInput(false);
    setCurrentField({ name: '', type: '', required: false });
  };

  const addField = () => {
    if (currentField.name.trim() && currentField.type) {
      const newField = {
        id: Date.now().toString(),
        name: currentField.name,
        type: currentField.type,
        required: currentField.required,
        children: currentField.type === 'Nested' ? [] : undefined
      };
      onSchemaChange([...schemaData, newField]);
      setCurrentField({ name: '', type: '', required: false });
      setShowFieldInput(false);
    }
  };

  const deleteField = (fieldId) => {
    const updatedSchema = schemaData.filter(field => field.id !== fieldId);
    onSchemaChange(updatedSchema);
  };

  const updateField = (fieldId, updates) => {
    const updatedSchema = schemaData.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onSchemaChange(updatedSchema);
  };

  // Recursive function to find and update nested fields
  const updateNestedFieldRecursive = (fields, targetId, updates) => {
    return fields.map(field => {
      if (field.id === targetId) {
        return { ...field, ...updates };
      } else if (field.children && field.children.length > 0) {
        return {
          ...field,
          children: updateNestedFieldRecursive(field.children, targetId, updates)
        };
      }
      return field;
    });
  };

  // Recursive function to find and delete nested fields
  const deleteNestedFieldRecursive = (fields, targetId) => {
    return fields.map(field => {
      if (field.children && field.children.length > 0) {
        return {
          ...field,
          children: field.children.filter(child => child.id !== targetId).map(child => 
            deleteNestedFieldRecursive([child], targetId)[0] || child
          )
        };
      }
      return field;
    });
  };

  const addNestedField = (parentId) => {
    const newNestedField = {
      id: Date.now().toString(),
      name: '',
      type: '',
      required: false,
      children: []
    };

    const addNestedFieldRecursive = (fields) => {
      return fields.map(field => {
        if (field.id === parentId) {
          return {
            ...field,
            children: [...(field.children || []), newNestedField]
          };
        } else if (field.children && field.children.length > 0) {
          return {
            ...field,
            children: addNestedFieldRecursive(field.children)
          };
        }
        return field;
      });
    };

    const updatedSchema = addNestedFieldRecursive(schemaData);
    onSchemaChange(updatedSchema);
  };

  const updateNestedField = (fieldId, updates) => {
    const updatedSchema = updateNestedFieldRecursive(schemaData, fieldId, updates);
    onSchemaChange(updatedSchema);
  };

  const deleteNestedField = (fieldId) => {
    const updatedSchema = deleteNestedFieldRecursive(schemaData, fieldId);
    onSchemaChange(updatedSchema);
  };

  const renderField = (field, level = 0, isLastChild = false) => {
    const hasChildren = field.type === 'Nested' && field.children && field.children.length > 0;
    
    return (
      <div key={field.id}>
        {/* Field Row with connecting line */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connecting line for nested fields */}
          {level > 0 && (
            <div style={{
              position: 'absolute',
              left: -10,
              top: 0,
              bottom: hasChildren ? 0 : '50%',
              width: 2,
              backgroundColor: '#d9d9d9',
              zIndex: 1
            }} />
          )}
          
          <Row gutter={8} align="middle" style={{ 
            marginBottom: 8, 
            marginLeft: level * 20,
            position: 'relative',
            zIndex: 2
          }}>
            <Col span={8}>
              <Input
                placeholder="Field name"
                value={field.name}
                onChange={(e) => {
                  if (level === 0) {
                    updateField(field.id, { name: e.target.value });
                  } else {
                    updateNestedField(field.id, { name: e.target.value });
                  }
                }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Field Type"
                value={field.type || undefined}
                onChange={(value) => {
                  if (level === 0) {
                    updateField(field.id, { type: value });
                  } else {
                    updateNestedField(field.id, { type: value });
                  }
                }}
                style={{ width: '100%' }}
                allowClear={false}
              >
                <Option value="String">String</Option>
                <Option value="Number">Number</Option>
                <Option value="Float">Float</Option>
                <Option value="ObjectID">ObjectID</Option>
                <Option value="Boolean">Boolean</Option>
                <Option value="Nested">Nested</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Switch
                checked={field.required}
                onChange={(checked) => {
                  if (level === 0) {
                    updateField(field.id, { required: checked });
                  } else {
                    updateNestedField(field.id, { required: checked });
                  }
                }}
              />
            </Col>
            <Col span={4}>
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  if (level === 0) {
                    deleteField(field.id);
                  } else {
                    deleteNestedField(field.id);
                  }
                }}
                size="small"
              />
            </Col>
          </Row>
        </div>

        {/* Nested Fields Section */}
        {field.type === 'Nested' && (
          <div style={{ 
            marginLeft: 20, 
            marginBottom: 8,
            position: 'relative'
          }}>
            {/* Nested Fields List */}
            {field.children && field.children.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                {field.children.map((child, index) => 
                  renderField(child, level + 1, index === field.children.length - 1)
                )}
              </div>
            )}
            
            {/* Add Nested Item Button */}
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => addNestedField(field.id)}
              style={{ marginLeft: 0 }}
            >
              + Add Item
            </Button>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    console.log('Schema Data:', schemaData);
    alert('Schema submitted! Check console for details.');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Existing Fields */}
      <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
        {schemaData.map((field, index) => 
          renderField(field, 0, index === schemaData.length - 1)
        )}
      </div>

      {/* Field Input Row - Show below existing fields when Add Item is clicked */}
      {showFieldInput && (
        <div style={{ marginBottom: 16 }}>
          <Row gutter={8} align="middle">
            <Col span={8}>
              <Input
                placeholder="Field name"
                value={currentField.name}
                onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Field Type"
                value={currentField.type || undefined}
                onChange={(value) => setCurrentField({ ...currentField, type: value })}
                style={{ width: '100%' }}
                allowClear={false}
              >
                <Option value="String">String</Option>
                <Option value="Number">Number</Option>
                <Option value="Float">Float</Option>
                <Option value="ObjectID">ObjectID</Option>
                <Option value="Boolean">Boolean</Option>
                <Option value="Nested">Nested</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Switch
                checked={currentField.required}
                onChange={(checked) => setCurrentField({ ...currentField, required: checked })}
              />
            </Col>
            <Col span={4}>
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                onClick={handleCancelField}
                size="small"
              />
            </Col>
          </Row>
        </div>
      )}

      {/* Global Add Item Button */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={showFieldInput ? addField : handleAddItem}
        style={{ width: '100%', marginBottom: 16 }}
        disabled={showFieldInput && (!currentField.name.trim() || !currentField.type)}
      >
        {showFieldInput ? '+ Add Field' : '+ Add Item'}
      </Button>

      {/* Submit Button */}
      <Button 
        type="default" 
        onClick={handleSubmit}
        style={{ alignSelf: 'flex-start' }}
      >
        Submit
      </Button>
    </div>
  );
};

export default SchemaBuilder; 