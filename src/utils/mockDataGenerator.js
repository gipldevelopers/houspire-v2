// src/utils/mockDataGenerator.js
export const generateMockBOQData = (projectId) => {
  const mockBOQ = {
    id: Date.now(),
    publicId: `boq_${Date.now()}`,
    projectId: projectId,
    title: 'Complete Interior Package',
    totalAmount: 1850000,
    currency: 'INR',
    status: 'GENERATED',
    preparedAt: new Date().toISOString(),
    items: [
      {
        id: 1,
        name: 'Living Room Modular Furniture',
        description: 'Custom designed sofa set with center table',
        category: 'Furniture',
        quantity: 1,
        unit: 'set',
        unitPrice: 350000,
        totalPrice: 350000,
        vendorName: 'Urban Living Interiors',
        brand: 'Custom Made'
      },
      {
        id: 2,
        name: 'Bedroom Wardrobe',
        description: 'Sliding door wardrobe with mirror finish',
        category: 'Carpentry',
        quantity: 2,
        unit: 'piece',
        unitPrice: 120000,
        totalPrice: 240000,
        vendorName: 'Precision Carpentry',
        brand: 'Asian Paints'
      },
      {
        id: 3,
        name: 'Kitchen Modular',
        description: 'Complete modular kitchen with appliances',
        category: 'Kitchen',
        quantity: 1,
        unit: 'set',
        unitPrice: 450000,
        totalPrice: 450000,
        vendorName: 'Kitchen Solutions',
        brand: 'Hafele'
      },
      {
        id: 4,
        name: 'Flooring - Vitrified Tiles',
        description: 'Premium vitrified tiles for entire apartment',
        category: 'Flooring',
        quantity: 1200,
        unit: 'sq ft',
        unitPrice: 85,
        totalPrice: 102000,
        vendorName: 'Tile Masters',
        brand: 'Kajaria'
      }
    ]
  };

  // Store in localStorage to simulate admin upload
  const existingBOQs = JSON.parse(localStorage.getItem('user_boqs') || '[]');
  const newBOQs = [...existingBOQs, mockBOQ];
  localStorage.setItem('user_boqs', JSON.stringify(newBOQs));

  // Create notification
  const newBOQNotification = {
    id: `boq_${Date.now()}`,
    type: 'boq',
    projectId: projectId,
    timestamp: new Date().toISOString()
  };

  const existingNotifications = JSON.parse(localStorage.getItem('new_boqs') || '[]');
  const updatedNotifications = [...existingNotifications, newBOQNotification];
  localStorage.setItem('new_boqs', JSON.stringify(updatedNotifications));
  localStorage.setItem('new_boq_count', updatedNotifications.length.toString());

  // Show success message
  alert('BOQ generated successfully! Check the BOQ page and sidebar notifications.');

  return mockBOQ;
};

export const generateMockRenders = (projectId) => {
  const roomTypes = ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'DINING_ROOM'];
  const angles = ['Front View', 'Corner View', 'Aerial View', 'Close-up', 'Wide Angle'];
  const styles = ['Modern Contemporary', 'Scandinavian', 'Minimalist', 'Industrial', 'Bohemian'];
  
  const mockRenders = roomTypes.map((roomType, index) => ({
    id: Date.now() + index,
    publicId: `render_${Date.now() + index}`,
    projectId: projectId,
    imageUrl: `/styles/interior${(index % 5) + 1}.jpg`,
    thumbnailUrl: `/styles/interior${(index % 5) + 1}.jpg`,
    roomType: roomType,
    angle: angles[index % angles.length],
    styleApplied: styles[index % styles.length],
    status: 'COMPLETED',
    isFinal: index === 0,
    generatedAt: new Date().toISOString()
  }));

  // Store in localStorage
  const existingRenders = JSON.parse(localStorage.getItem('user_renders') || '[]');
  const newRenders = [...existingRenders, ...mockRenders];
  localStorage.setItem('user_renders', JSON.stringify(newRenders));

  // Create notification
  const newRenderNotification = {
    id: `render_${Date.now()}`,
    type: 'render',
    projectId: projectId,
    timestamp: new Date().toISOString()
  };

  const existingNotifications = JSON.parse(localStorage.getItem('new_renders') || '[]');
  const updatedNotifications = [...existingNotifications, newRenderNotification];
  localStorage.setItem('new_renders', JSON.stringify(updatedNotifications));
  localStorage.setItem('new_renders_count', updatedNotifications.length.toString());

  alert(`${mockRenders.length} renders generated successfully! Check the Renders page and sidebar notifications.`);

  return mockRenders;
};

// Add this to your src/utils/mockDataGenerator.js
export const generateMockNotifications = (projectId, type) => {
  const projectTitles = {
    'proj_1': 'Modern Living Room Redesign',
    'proj_2': 'Luxury Bedroom Suite'
  };

  const notificationData = {
    RENDER_READY: {
      id: `render_${Date.now()}`,
      type: 'RENDER_READY',
      title: 'Renders Ready!',
      message: `Your 3D renders for "${projectTitles[projectId] || 'your project'}" are now available for review`,
      priority: 'HIGH',
      actionUrl: `/dashboard/renders?project=${projectId}`
    },
    BOQ_READY: {
      id: `boq_${Date.now()}`,
      type: 'BOQ_READY', 
      title: 'BOQ Generated!',
      message: `Bill of Quantities for "${projectTitles[projectId] || 'your project'}" has been generated`,
      priority: 'MEDIUM',
      actionUrl: `/dashboard/boq?project=${projectId}`
    }
  };

  const notification = notificationData[type];
  if (!notification) return null;

  // Store in appropriate localStorage
  if (type === 'RENDER_READY') {
    const existing = JSON.parse(localStorage.getItem('new_renders') || '[]');
    const updated = [...existing, { ...notification, projectId, timestamp: new Date().toISOString() }];
    localStorage.setItem('new_renders', JSON.stringify(updated));
    localStorage.setItem('new_renders_count', updated.length.toString());
  } else if (type === 'BOQ_READY') {
    const existing = JSON.parse(localStorage.getItem('new_boqs') || '[]');
    const updated = [...existing, { ...notification, projectId, timestamp: new Date().toISOString() }];
    localStorage.setItem('new_boqs', JSON.stringify(updated));
    localStorage.setItem('new_boq_count', updated.length.toString());
  }

  // Trigger notification updates
  window.dispatchEvent(new Event('notificationUpdate'));

  return notification;
};