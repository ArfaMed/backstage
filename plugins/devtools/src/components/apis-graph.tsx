/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Edge } from 'react-flow-renderer';
import { BackstageApp } from '@backstage/core-app-api';

import { useDevToolsApis } from '../hooks-internal/apis';
import { Graph, UnpositionedNode } from './graph';

export interface ApisGraphProps {
  app: BackstageApp;
}

export function ApisGraph(props: ApisGraphProps) {
  const { app } = props;

  const apis = useDevToolsApis(app);

  const apisWithEdges = apis.filter(
    api => api.dependents.length > 0 || api.dependencies.length > 0,
  );

  const nodes: UnpositionedNode[] = apisWithEdges.map(api => ({
    id: api.id,
    name: api.id,
    data: { label: api.id },
  }));
  const edges: Edge[] = apisWithEdges.flatMap(api =>
    api.dependencies.map(
      (dep): Edge => ({
        id: `${api.id}---${dep.id}`,
        source: dep.id,
        target: api.id,
        animated: true,
      }),
    ),
  );

  return <Graph nodes={nodes} edges={edges} />;
}