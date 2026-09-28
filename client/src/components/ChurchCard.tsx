import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Church } from '@/constants/mockChurches';

interface Props {
  church: Church;
  onSelect?: (church: Church) => void;
}

export const ChurchCard: React.FC = ({ church, onSelect }) => {
  const feedbackCount = church.userFeedback ? church.userFeedback.length : 0;

  return (
     onSelect && onSelect(church)}
      activeOpacity={onSelect ? 0.7 : 1}
      testID={`church-card-${church.id}`}
    >
      
        {church.name}
        {church.rating && (
          
            ★ {church.rating.toFixed(1)}
          
        )}
      

      
        {church.denomination}
        {church.worshipStyle && (
          {church.worshipStyle}
        )}
        {church.distanceMiles !== undefined && (
          {church.distanceMiles} mi from campus
        )}
      

      
        📍 {church.address}, {church.city}, {church.state} {church.zipcode}
      
      
        🕒 Services: {church.serviceTimes}
      

      {/* Story C: Feedback Preview */}
      
        
          💬 {feedbackCount} student {feedbackCount === 1 ? 'review' : 'reviews'}
        
        {onSelect && View Details →}
      
    
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d97706',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  denominationTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  styleTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distanceTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  details: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  feedbackCountText: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
});