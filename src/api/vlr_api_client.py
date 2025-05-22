#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
VLR API Client for VALORANT Player Growth Story Site
vlr.orlandomm.net APIを利用してVALORANTプレイヤーデータを取得するクライアント
"""

import requests
import json
import os
import time
from datetime import datetime
import pandas as pd

class VlrApiClient:
    """VLR.gg APIクライアント"""
    
    def __init__(self, base_url="https://vlr.orlandomm.net/api/v1"):
        """初期化"""
        self.base_url = base_url
        self.cache_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'api_cache')
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # APIリクエスト間の待機時間（秒）- サーバー負荷軽減のため
        self.request_delay = 1
        
        # 最後のリクエスト時間
        self.last_request_time = 0
    
    def _make_request(self, endpoint, params=None):
        """APIリクエストを実行"""
        # リクエスト間隔を確保
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        if time_since_last_request < self.request_delay:
            time.sleep(self.request_delay - time_since_last_request)
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # エラーレスポンスの場合は例外を発生
            
            self.last_request_time = time.time()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"APIリクエストエラー: {e}")
            return None
    
    def _cache_response(self, endpoint, params, data):
        """APIレスポンスをキャッシュ"""
        # キャッシュファイル名の生成
        param_str = "_".join([f"{k}={v}" for k, v in params.items()]) if params else "no_params"
        cache_file = os.path.join(self.cache_dir, f"{endpoint.replace('/', '_')}_{param_str}.json")
        
        # データとキャッシュ時間を保存
        cache_data = {
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    
    def _get_cached_response(self, endpoint, params, max_age_hours=24):
        """キャッシュからレスポンスを取得"""
        # キャッシュファイル名の生成
        param_str = "_".join([f"{k}={v}" for k, v in params.items()]) if params else "no_params"
        cache_file = os.path.join(self.cache_dir, f"{endpoint.replace('/', '_')}_{param_str}.json")
        
        if not os.path.exists(cache_file):
            return None
        
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            # キャッシュの有効期限をチェック
            cache_time = datetime.fromisoformat(cache_data["timestamp"])
            current_time = datetime.now()
            age_hours = (current_time - cache_time).total_seconds() / 3600
            
            if age_hours > max_age_hours:
                return None  # キャッシュ期限切れ
            
            return cache_data["data"]
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"キャッシュ読み込みエラー: {e}")
            return None
    
    def get_players(self, limit=100, page=1, country=None, use_cache=True):
        """プレイヤー一覧を取得"""
        endpoint = "players"
        params = {"limit": limit, "page": page}
        
        if country:
            params["country"] = country
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, params)
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint, params)
        
        if data and use_cache:
            self._cache_response(endpoint, params, data)
        
        return data
    
    def get_player(self, player_id, use_cache=True):
        """プレイヤー詳細を取得"""
        endpoint = f"players/{player_id}"
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, {})
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint)
        
        if data and use_cache:
            self._cache_response(endpoint, {}, data)
        
        return data
    
    def get_teams(self, limit=100, page=1, region=None, use_cache=True):
        """チーム一覧を取得"""
        endpoint = "teams"
        params = {"limit": limit, "page": page}
        
        if region:
            params["region"] = region
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, params)
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint, params)
        
        if data and use_cache:
            self._cache_response(endpoint, params, data)
        
        return data
    
    def get_team(self, team_id, use_cache=True):
        """チーム詳細を取得"""
        endpoint = f"teams/{team_id}"
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, {})
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint)
        
        if data and use_cache:
            self._cache_response(endpoint, {}, data)
        
        return data
    
    def get_events(self, limit=100, page=1, status=None, region=None, use_cache=True):
        """イベント一覧を取得"""
        endpoint = "events"
        params = {"limit": limit, "page": page}
        
        if status:
            params["status"] = status
        
        if region:
            params["region"] = region
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, params)
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint, params)
        
        if data and use_cache:
            self._cache_response(endpoint, params, data)
        
        return data
    
    def get_matches(self, limit=100, page=1, use_cache=True):
        """試合一覧を取得"""
        endpoint = "matches"
        params = {"limit": limit, "page": page}
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, params)
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint, params)
        
        if data and use_cache:
            self._cache_response(endpoint, params, data)
        
        return data
    
    def get_results(self, limit=100, page=1, use_cache=True):
        """試合結果一覧を取得"""
        endpoint = "results"
        params = {"limit": limit, "page": page}
        
        # キャッシュをチェック
        if use_cache:
            cached_data = self._get_cached_response(endpoint, params)
            if cached_data:
                return cached_data
        
        # APIリクエスト
        data = self._make_request(endpoint, params)
        
        if data and use_cache:
            self._cache_response(endpoint, params, data)
        
        return data
    
    def get_all_japanese_players(self, use_cache=True):
        """日本人プレイヤーをすべて取得"""
        all_players = []
        page = 1
        
        while True:
            players_data = self.get_players(limit=100, page=page, country="jp", use_cache=use_cache)
            
            if not players_data or not players_data.get("data") or len(players_data["data"]) == 0:
                break
            
            all_players.extend(players_data["data"])
            
            # 次のページがなければ終了
            if not players_data.get("pagination", {}).get("hasNextPage", False):
                break
            
            page += 1
        
        return all_players
    
    def get_player_match_history(self, player_id, use_cache=True):
        """プレイヤーの試合履歴を取得"""
        player_data = self.get_player(player_id, use_cache=use_cache)
        
        if not player_data or not player_data.get("data") or not player_data["data"].get("results"):
            return []
        
        return player_data["data"]["results"]
    
    def process_player_data_for_growth_story(self, player_id):
        """成長ストーリー用にプレイヤーデータを処理"""
        # プレイヤー詳細データを取得
        player_data = self.get_player(player_id)
        
        if not player_data or not player_data.get("data"):
            print(f"プレイヤーID {player_id} のデータが見つかりません")
            return None
        
        player_info = player_data["data"]["info"]
        player_team = player_data["data"].get("team", {})
        player_results = player_data["data"].get("results", [])
        
        # 基本情報の整理
        processed_data = {
            "info": {
                "player_id": player_id,
                "name": player_info.get("user", ""),
                "full_name": player_info.get("name", ""),
                "team": player_team.get("name", ""),
                "team_id": player_team.get("id", ""),
                "country": player_info.get("country", ""),
                "image_url": player_info.get("img", ""),
                "url": player_info.get("url", ""),
                "social_links": {
                    "twitter": player_data["data"].get("socials", {}).get("twitter", ""),
                    "twitch": player_data["data"].get("socials", {}).get("twitch", "")
                },
                "last_updated": datetime.now().isoformat()
            },
            "matches": [],
            "agents": [],
            "maps": []
        }
        
        # 試合データの処理
        for result in player_results:
            match_info = result.get("match", {})
            event_info = result.get("event", {})
            teams_info = result.get("teams", [])
            
            # チーム情報の処理
            team1 = teams_info[0] if len(teams_info) > 0 else {}
            team2 = teams_info[1] if len(teams_info) > 1 else {}
            
            # プレイヤーのチームとスコアを特定
            player_team_name = player_team.get("name", "")
            player_team_info = team1 if team1.get("name") == player_team_name else team2
            opponent_team_info = team2 if team1.get("name") == player_team_name else team1
            
            # 勝敗判定
            player_score = int(player_team_info.get("points", 0))
            opponent_score = int(opponent_team_info.get("points", 0))
            result_str = "W" if player_score > opponent_score else "L" if player_score < opponent_score else "D"
            
            # 試合データの構築
            match_data = {
                "match_id": match_info.get("id", ""),
                "date": "",  # APIからは日付が取得できないため空欄
                "event": event_info.get("name", ""),
                "event_logo": event_info.get("logo", ""),
                "opponent": opponent_team_info.get("name", ""),
                "opponent_tag": opponent_team_info.get("tag", ""),
                "opponent_logo": opponent_team_info.get("logo", ""),
                "result": result_str,
                "score": f"{player_score}:{opponent_score}",
                "match_url": match_info.get("url", ""),
                "stats": {}  # APIからは詳細な統計が取得できないため空欄
            }
            
            processed_data["matches"].append(match_data)
        
        return processed_data
    
    def get_japanese_players_data(self):
        """日本人プレイヤーのデータを取得"""
        # 日本人プレイヤー一覧を取得
        japanese_players = self.get_all_japanese_players()
        
        players_data = []
        
        for player in japanese_players:
            player_id = player.get("id")
            if player_id:
                # プレイヤー詳細データを取得
                player_data = self.process_player_data_for_growth_story(player_id)
                if player_data:
                    players_data.append(player_data)
        
        return players_data

# 実行例
if __name__ == "__main__":
    client = VlrApiClient()
    
    # 日本人プレイヤーの取得テスト
    japanese_players = client.get_all_japanese_players()
    print(f"日本人プレイヤー数: {len(japanese_players)}")
    
    if japanese_players:
        # 最初の5人を表示
        for i, player in enumerate(japanese_players[:5]):
            print(f"{i+1}. {player.get('name')} (ID: {player.get('id')})")
        
        # 最初のプレイヤーの詳細を取得
        first_player_id = japanese_players[0].get('id')
        player_data = client.get_player(first_player_id)
        
        if player_data and player_data.get("data"):
            player_info = player_data["data"]["info"]
            print(f"\nプレイヤー詳細: {player_info.get('user')} ({player_info.get('country')})")
            
            # 成長ストーリー用データ処理
            processed_data = client.process_player_data_for_growth_story(first_player_id)
            
            if processed_data:
                # 処理したデータをJSONファイルとして保存
                output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'api_processed')
                os.makedirs(output_dir, exist_ok=True)
                
                output_file = os.path.join(output_dir, f"{first_player_id}.json")
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(processed_data, f, ensure_ascii=False, indent=2)
                
                print(f"処理済みデータを保存しました: {output_file}")
