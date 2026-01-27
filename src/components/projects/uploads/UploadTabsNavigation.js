// src/components/projects/uploads/UploadTabsNavigation.js
'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function UploadTabsNavigation({ 
  activeTab, 
  tabs, 
  stats, 
  formatFileSize, 
  hasFloorPlan,
  mobileView = false 
}) {
  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Tab Navigation */}
      <Card className="border-border bg-card">
        <CardContent className="p-2">
          <TabsList className={`grid bg-muted p-1 rounded-lg w-full h-auto ${
            tabs.length === 1 ? 'grid-cols-1' : 
            tabs.length === 2 ? 'grid-cols-2' : 
            'grid-cols-3'
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className={`
                    relative flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium
                    transition-all duration-200 group h-auto min-h-10
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'bg-transparent text-muted-foreground hover:bg-background hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`
                        ml-1 text-xs
                        ${isActive 
                          ? 'bg-primary-foreground/20 text-primary-foreground' 
                          : 'bg-muted text-foreground'
                        }
                      `}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </CardContent>
      </Card>

      {/* Active Tab Information */}
      {activeTabConfig && (
        <Card className="border-border bg-muted">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1 sm:p-2 rounded-lg ${activeTab === activeTabConfig.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                  <activeTabConfig.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{activeTabConfig.label}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activeTabConfig.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="text-right">
                  <div className="text-muted-foreground">{mobileView ? 'Files' : 'Total Files'}</div>
                  <div className="font-semibold text-foreground">{stats.totalFiles} {mobileView ? '' : 'files'}</div>
                </div>
                <div className="w-px h-6 sm:h-8 bg-border"></div>
                <div className="text-right">
                  <div className="text-muted-foreground">{mobileView ? 'Size' : 'Total Size'}</div>
                  <div className="font-semibold text-foreground">{formatFileSize(stats.totalSize)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}