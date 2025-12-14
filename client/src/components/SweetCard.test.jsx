import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SweetCard from './SweetCard';

describe('SweetCard Component', () => {
  const mockSweet = {
    _id: '123',
    name: 'Test Ladoo',
    category: 'Ghee',
    price: 20,
    quantity: 5
  };

  const mockOutOfStockSweet = {
    ...mockSweet,
    quantity: 0
  };

  it('renders sweet details correctly', () => {
    render(<SweetCard sweet={mockSweet} />);
    
    expect(screen.getByText('Test Ladoo')).toBeInTheDocument();
    expect(screen.getByText('₹20')).toBeInTheDocument();
    expect(screen.getByText('5 left')).toBeInTheDocument();
  });

  it('disables buy button when out of stock', () => {
    render(<SweetCard sweet={mockOutOfStockSweet} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Sold Out');
  });

  it('calls onPurchase when clicked', () => {
    const handlePurchase = vi.fn();
    render(<SweetCard sweet={mockSweet} onPurchase={handlePurchase} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handlePurchase).toHaveBeenCalledWith('123');
  });

  it('shows admin controls when isAdmin is true', () => {
    render(<SweetCard sweet={mockSweet} isAdmin={true} />);
    
    expect(screen.getByTitle('Edit Sweet')).toBeInTheDocument();
    expect(screen.getByTitle('Delete Sweet')).toBeInTheDocument();
  });

  it('does NOT show admin controls when isAdmin is false', () => {
    render(<SweetCard sweet={mockSweet} isAdmin={false} />);
    
    expect(screen.queryByTitle('Edit Sweet')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete Sweet')).not.toBeInTheDocument();
  });

  it('renders specific image if provided', () => {
    const sweetWithImage = { ...mockSweet, image: '/images/test.jpg' };
    render(<SweetCard sweet={sweetWithImage} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/test.jpg');
  });

  it('falls back to default image if sweet has no image property', () => {
    // Sweet with undefined image
    const sweetNoImage = { ...mockSweet, image: undefined };
    render(<SweetCard sweet={sweetNoImage} />);
    
    const img = screen.getByRole('img');
    // We expect our logic to default to this
    expect(img).toHaveAttribute('src', '/images/sweets.jpg');
  });

  it('shows emoji fallback when image loading fails', () => {
    render(<SweetCard sweet={mockSweet} />);
    
    const img = screen.getByRole('img');
    
    // Simulate an error (broken link)
    fireEvent.error(img);
    expect(screen.getByText('🍬')).toBeInTheDocument();
  });
});